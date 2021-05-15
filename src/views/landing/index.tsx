import React from 'react';
import { connect } from 'react-redux';
import { BlockchainInfo, Mempool, Transactions } from '../../containers';

import { createNewClient } from '../../redux';
import * as bchrpc from '../../protos/BchrpcServiceClientPb';


interface AppProps {
  client: bchrpc.bchrpcClient,
  client_error: string | null,
  createNewClient: Function
}

interface AppState {
  client_error: string | null
}

class Landing extends React.Component<AppProps, AppState>{
    constructor(props){
      super(props);
      this.state = {
        client_error: this.props.client_error
      }
    }

    componentDidMount(){
      this.props.createNewClient();
    }

    renderError = () => {
      const { client_error } = this.props;
      if (client_error !== null) {
        return (
          <h5 style={{ backgroundColor: 'rgb(255, 100, 100)', margin: 0}}>
            Error: {client_error}
          </h5>
        )
      }
      return undefined
    }
    
    renderMempoolInfo = () => {
      const { client_error } = this.props;
      if (client_error !== null){
          return undefined 
      }
      return <Mempool/>
    }

    renderBlockchainInfo = () => {
      const { client_error } = this.props;
      if (client_error !== null){
          return undefined 
      }
      return <BlockchainInfo/>
    }

    renderTransactionsInfo = () => {
      const { client_error } = this.props;
      if (client_error !== null){
          return undefined 
      }
      return <Transactions/>
    }

    render(){
      return (
        <div className="App">
          <header className="App-header" style={{display: 'flex', alignItems: 'stretch'}}>
            {this.renderError()}
            <h1>
              Cash Kit
            </h1>
          </header>
          <div>
            {this.renderBlockchainInfo()}
            {this.renderMempoolInfo()}
            {this.renderTransactionsInfo()}
          </div>
        </div>
      )
    }
}


const mapDispatchToProps = dispatch => {
	return {
    createNewClient: () => {
      dispatch(createNewClient());
    },
  };
};

const mapStateToProps = state => {
	return {
    client: state.AppReducer.client,
		client_error: state.AppReducer.client_error,
  };
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Landing);