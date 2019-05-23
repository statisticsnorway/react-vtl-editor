import React, {Component} from 'react';
import {FlameGraph} from 'react-flame-graph';
import Axios, {CancelToken} from "axios";
import {operationNameMap} from "./Explain";

const axios = Axios.create({withCredentials: true});

class VtlProfiler extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile: false
    }
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
      let profile = this.convertProfile(resp.data);
      this.setState({profile});
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

  formatNano(value) {
    const prefixes = [
      {unit: 'ns', divider: 1000},
      {unit: 'µs', divider: 1000},
      {unit: 'ms', divider: 1000},
      {unit: 's', divider: 60},
      {unit: 'h', divider: 60},
      {unit: 'd', divider: 60}
    ];
    let current = value;
    for (const {unit, divider} of prefixes) {
      if (current / divider < 2) {
        return `${Math.round(current)}${unit}`
      } else {
        current = current / divider;
      }
    }
    return Math.round(value);
  }

  convertProfile(profile) {
    const opName = operationNameMap[profile.operationType] || profile.operationType;
    const totalTime = profile.timeTotal;
    const filterTime = profile.filterTimeTotal;
    const sortTime = profile.sortTimeTotal;
    const avgTime = profile.timeTotal / profile.timeCount;
    const rows = profile.rows;
    const cells = profile.cells;

    const name = `${opName} (time: ${this.formatNano(totalTime)} (${this.formatNano(avgTime)}), sort: ${this.formatNano(sortTime)}, filter: ${this.formatNano(filterTime)}) rows: ${rows}, cells: ${cells}`;
    return {
      name: name,
      value: totalTime || 1,
      tooltip: `${name}\nOrdering: ${profile.order}\nFilter: ${profile.filter}`,
      children: profile.parents.map(parentProfile => this.convertProfile(parentProfile))
    }
  }

  render() {
    const {loading, error, profile} = this.state;
    if (loading) return <div>Loading</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>No data</div>;

    return <FlameGraph data={profile} height={this.props.height} width={this.props.width}/>
  }
}

export default VtlProfiler;