import React, {Component} from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import * as classnames from "classnames";
import PagedDatasetTable from "../../dataset/PagedDatasetTable";
import Config from "../../../Config";
import VtlPlan from "../explain/Explain";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBrain, faClock, faTable} from "@fortawesome/free-solid-svg-icons";
import VtlProfiler from "../explain/Profiler";

const DATA = "data";
const EXPLAIN = "explain";
const PROFILE = "profile";

/**
 * Vertical tab that shows the data, plan or profile.
 */
class InspectorWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: DATA
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  componentDidMount() {
    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;
    this.setState({ height, width});
  }

  render() {
    return (
      <div ref={ (divElement) => this.divElement = divElement}>
        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({active: this.state.activeTab === DATA})}
                     onClick={() => {
                       this.toggle(DATA);
                     }}>
              <FontAwesomeIcon icon={faTable} title="Show data" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({active: this.state.activeTab === EXPLAIN})}
                     onClick={() => {
                       this.toggle(EXPLAIN);
                     }}>
              <FontAwesomeIcon icon={faBrain} title="Show execution plan"/>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({active: this.state.activeTab === PROFILE})}
                     onClick={() => {
                       this.toggle(PROFILE);
                     }}>
              <FontAwesomeIcon icon={faClock} title="Show profiler" />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab} >
          { this.renderTab(this.state.activeTab) }
        </TabContent>

      </div>
    );
  }

  renderTab(activeTab) {
    switch (activeTab) {
      case DATA:
        return <TabPane tabId={DATA}>
          <PagedDatasetTable href={`${Config.vtlUrl}/inspect/${this.props.href}`}/>
        </TabPane>
      case EXPLAIN:
        return <TabPane tabId={EXPLAIN}>
          <VtlPlan href={`${Config.vtlUrl}/explain/${this.props.href}`}/>
        </TabPane>
      case PROFILE:
        return <TabPane tabId={PROFILE}>
          <VtlProfiler href={`${Config.vtlUrl}/profile/${this.props.href}`}
                       width={this.state.width}
                       height={this.state.height}
          />
        </TabPane>
    }
  }
}

export default InspectorWidget
