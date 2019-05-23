import React, {Component} from "react";
import Axios, {CancelToken} from "axios";
import './Explain.scss';
import {Col, Row} from "reactstrap";
import {faFilter} from "@fortawesome/free-solid-svg-icons";

const axios = Axios.create({withCredentials: true});

/* Maps the class name to readable name */
export const operationNameMap = {
  'no.ssb.vtl.script.operations.filter.FilterOperation': 'Filter',
  'no.ssb.vtl.script.operations.join.InnerJoinOperation': 'Inner join',
  'no.ssb.vtl.script.operations.unfold.UnfoldOperation' : 'Unfold',
  'no.ssb.vtl.script.operations.join.JoinAssignment': 'Assignment',
  'no.ssb.vtl.script.operations.aggregation.AggregationOperation': 'Aggregation',
  'no.ssb.vtl.script.operations.rename.RenameOperation': 'Rename',
  'no.ssb.vtl.script.operations.fold.FoldOperation' : 'Fold',
  'no.ssb.vtl.script.operations.drop.KeepOperation' : 'Keep',
  'no.ssb.vtl.script.operations.DatasetOperationWrapper' : 'Connector'
};

export const operationIconMap = {
  'no.ssb.vtl.script.operations.filter.FilterOperation': faFilter,
  'no.ssb.vtl.script.operations.join.InnerJoinOperation': 'Inner join',
  'no.ssb.vtl.script.operations.unfold.UnfoldOperation' : 'Unfold',
  'no.ssb.vtl.script.operations.join.JoinAssignment': 'Assignment',
  'no.ssb.vtl.script.operations.aggregation.AggregationOperation': 'Aggregation',
  'no.ssb.vtl.script.operations.rename.RenameOperation': 'Rename',
  'no.ssb.vtl.script.operations.fold.FoldOperation' : 'Fold',
  'no.ssb.vtl.script.operations.drop.KeepOperation' : 'Keep'
};

export const VtlPlanNode = ({node}) => {
  const {
    operationType,
    operationId,
    order,
    filter,
    parents
  } = node;

  const operationName = operationNameMap[operationType] || operationType;
  return (
    <div className="vtl-plan-node">
      <div className="info">
        <Row >
          <Col md={3} lg={2} xl={1} className="text-right"><strong>Operation</strong></Col>
          <Col md={9} lg={10} xl={11}>{operationName} ({operationId})</Col>
        </Row>
        <Row>
          <Col md={3} lg={2} xl={1} className="text-right"><strong>Order</strong></Col>
          <Col md={9} lg={10} xl={11}>{order}</Col>
        </Row>
        <Row>
          <Col md={3} lg={2} xl={1} className="text-right"><strong>Filter</strong></Col>
          <Col md={9} lg={10} xl={11}>{filter}</Col>
        </Row>
      </div>


      {parents.map(parent => (
        <VtlPlanNode key={parent.id} node={parent}/>
      ))}

    </div>
  )
};

/**
 * Shows the execution plan of a vtl execution.
 */
class VtlPlan extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      node: null
    };
  }

  componentWillUnmount() {
    if (this._source !== undefined) {
      this._source.cancel('Operation canceled due to unmount.')
    }
  }

  componentDidMount() {
    this.fetchData(this.props.href);
  }

  fetchData(href) {
    // cancel the previous request
    if (this._source !== undefined) {
      this._source.cancel('Operation canceled due to new request.')
    }
    // create a new cancel token
    this._source = CancelToken.source();

    this.setState({loading: true});
    axios.get(href, {
      cancelToken: this._source.token
    }).then(resp => {
      let node = resp.data;
      this.setState({node, loading: false});
    }).catch(error => {
      if (Axios.isCancel(error)) {
        console.log('Request canceled', error);
      } else {
        this.setState({error});
      }
    }).finally(() => {
      this.setState({loading: false})
    });
  }

  render() {
    return (
      <div className="vtl-plan">
        {(this.state.loading || !this.state.node
            ? <p>loading...</p>
            : <VtlPlanNode key={this.state.node.id} node={this.state.node}/>
        )}
      </div>
    );
  }
}

export default VtlPlan;