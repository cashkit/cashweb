import React from 'react';
import { connect } from 'react-redux';
import { GrpcManager } from '../../managers';
import { Transaction } from '../../protos/bchrpc_pb';
import { updateErrorState, updateTxHash } from '../../redux';
import { base64toU8, u8toHex } from '../../utils';


function InfoComponent({
  blockHeight,
  confirmations,
  lockTime,
  size,
  timestamp,
  version, }
  :  {
    version: number | undefined,
    lockTime: number | undefined,
    size: number | undefined,
    timestamp: number | undefined,
    confirmations: number | undefined,
    blockHeight: number | undefined,
 }) {
return(
  <>
    <div className="tile is-ancestor">
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">Version</p>
          <div className="content">{version}</div>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">Block Height</p>
          <div className="content">{blockHeight}</div>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">Timestamp</p>
          <div className="content">{timestamp}</div>
        </article>
      </div>
    </div>

    <div className="tile is-ancestor">
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">LockTime</p>
          <div className="content">{lockTime}</div>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">Confirmations</p>
          <div className="content">{confirmations}</div>
        </article>
      </div>

      <div className="tile is-parent">
        <article className="tile is-child box has-text-left">
          <p className="is-size-4 has-text-weight-medium">Size</p>
          <div className="content">{size}</div>
        </article>
      </div>
    </div>
    </>
  )
}

function InfoViaHashes({ hash, blockHash, onClickHash }
  : {  hash: Uint8Array | string | undefined,
    blockHash: Uint8Array | string | undefined,
    onClickHash: (txHash: Uint8Array | string | undefined) => void,
  }) {
return(
  <>
    <div className="tile is-ancestor">
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left notification is-primary">
          <p className="is-size-4 has-text-weight-medium">Tx Hash</p>
          <div className="content">{hash}</div>
        </article>
      </div>
      <div className="tile is-parent">
        <article className="tile is-child box has-text-left  is-info">
          <p className="is-size-4 has-text-weight-medium">Block Hash</p>
          <a className="content" onClick={() => onClickHash(blockHash)}>{blockHash}</a>
        </article>
      </div>
    </div>
  </>
  )
}

function InfoInputOutputHashes({ inputsList, outputsList, onClickHash }
  : { 
    inputsList: Array<Transaction.Input.AsObject> | undefined,
    outputsList: Array<Transaction.Output.AsObject> | undefined,
    onClickHash: (txHash: Uint8Array | string | undefined) => void,
  }) {
  let InputsComponent: any = undefined;
  if (inputsList){
  InputsComponent = inputsList.map((input) => {
      const addr = input.address
       return <div key={addr} className="content">bitcoincash:{addr}</div>
     })
  }
  let OutputsComponent: any = undefined;
  if (outputsList){
  OutputsComponent = outputsList.map((output) => {
       const addr = output.address
       return <div key={addr} className="content">bitcoincash:{addr}</div>
     })
  }
return(
  <>
    <div className="tile is-ancestor">
      <div className="tile is-parent">
       <article className="tile is-child box has-text-left">
         <p className="is-size-4 has-text-weight-medium">Inputs Address List ({inputsList?.length})</p>
         {InputsComponent}
       </article>
     </div>
      <div className="tile is-parent">
       <article className="tile is-child box has-text-left">
         <p className="is-size-4 has-text-weight-medium">Outputs Address List ({outputsList?.length})</p>
         {OutputsComponent}
       </article>
     </div>
      
    </div>
  </>
  )
}

/**
 * From React Docs:
 * If your component renders the same result given the same props,
 * you can wrap it in a call to React.memo for a performance boost
 * in some cases by memoizing the result. This means that React will
 * skip rendering the component, and reuse the last rendered result.
 */
const MemoizedInfoComponent = React.memo(InfoComponent);
const MemoizedInfoViaHashesComponent = React.memo(InfoViaHashes);
const MemoizedInfoInputOutputHashes = React.memo(InfoInputOutputHashes);

interface TxInfoProps {
   client: GrpcManager,
   updateErrorState: ({}) => void,
   updateTxHash: ({}) => void,
   txHash: string | undefined,
   clientError: string | undefined
}

interface TxInfoState {
  hash: Uint8Array | string | undefined,
  version: number | undefined,
  inputsList: Array<Transaction.Input.AsObject> | undefined,
  outputsList: Array<Transaction.Output.AsObject> | undefined,
  lockTime: number | undefined,
  size: number | undefined,
  timestamp: number | undefined,
  confirmations: number | undefined,
  blockHeight: number | undefined,
  blockHash: Uint8Array | string | undefined,
  txHash: string | undefined,
  // To be added soon
  // slpTransactionInfo?: SlpTransactionInfo.AsObject,
}


class TxInfo extends React.PureComponent<TxInfoProps, TxInfoState>{

  searchTxInputRef: React.RefObject<any>;

  constructor(props: TxInfoProps){
    super(props)
    this.searchTxInputRef = React.createRef();
    // Setting default values
    this.state = this.getInitialState()
  }

  componentDidMount(){
    this.fetchTxDetails({ txHash: null })
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // If the new hash is different forom the old one.
    // return the snapshot to be compared later.
    if (prevProps.txHash !== this.props.txHash) {
      return this.props.txHash
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      console.log("snapshot", snapshot, this.state.txHash)
      this.setState({ txHash: snapshot }, () => {
        this.fetchTxDetails({ txHash: snapshot })
      })
    }
  }

  getInitialState = () => {
    return {
      hash: "",
      version: 0,
      inputsList: [],
      outputsList: [],
      lockTime: 0,
      size: 0,
      timestamp: 0,
      confirmations: 0,
      blockHeight: 0,
      blockHash: "",
      txHash: ""
    }
  }

  fetchTxDetails = ({ txHash }) => {
    const { client, updateErrorState } = this.props;
    if (client && txHash){
      client.getTransaction({ hashHex: txHash }).then((res) => {
          // Convert the blockhash from base64 to hex.
          const txn = res.hasTransaction() && res.getTransaction()?.toObject()

          if (txn){
            let hash64 = res.getTransaction()?.getHash_asB64()
            // @ts-ignore
            let b2u = base64toU8(hash64).reverse()
            const txHash = u8toHex(b2u)

            hash64 = res.getTransaction()?.getBlockHash_asB64()
            // @ts-ignore
            b2u = base64toU8(hash64).reverse()
            const blockHash = u8toHex(b2u)

            this.setState({
              blockHash: blockHash,
              blockHeight: txn.blockHeight,
              confirmations: txn.confirmations,
              hash: txHash,
              inputsList: txn.inputsList,
              lockTime: txn.lockTime,
              outputsList: txn.outputsList,
              size: txn.size,
              // TODO: Complete the SLP INFO.
              // slpTransactionInfo: {slpAction: 10, validityJudgement: 0, parseError: "", tokenId: "xA+Bdug1yiMGPZ90oFhJZIJos7nn3rhsbhkPw525lu0=", burnFlagsList: [], …}
              timestamp: txn.timestamp,
              version: txn.version,
            })
          }
        }).catch((err) => {
          console.log("[ERR] fetchTxDetails: ", err)
          this.setState({ ...this.getInitialState() })
          updateErrorState({clientError: JSON.stringify(err)})
      })
    }
  }

  onSearchTxn = () => {
    const ref = this.searchTxInputRef.current
    this.fetchTxDetails({ txHash: ref.value })
    this.props.updateTxHash({ txHash: ref.value })
  }

  onChangeSearchVal = (event) => {
    const {value}  = event.target
    this.setState(() => {return { txHash: value }})
  }

  getAndUpdateTxHash = (txHash) => {
    this.fetchTxDetails({ txHash: txHash })
  }

  renderSearch = () => {
    return(
      <div className="mb-4">
        <h1 className="title">Txn Information</h1>
        <div className="field has-addons is-12">
          <div className="control is-expanded">
            <input value={this.state.txHash}
              onChange={this.onChangeSearchVal}
              ref={this.searchTxInputRef}
              className="input is-rounded is-large"
              type="text"
              placeholder="Txn hash"
            />
          </div>
          <div className="control">
            <a className="button is-link is-large" onClick={this.onSearchTxn}>
              Search
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Need to perform the check for `clientError` because once the component is rendered,
  // react tries to rerender/perform life cycles when any(the one component listens to) prop updates
  // and in the parent component we have added a statement to render undefined/some other 
  // component when the value of `clientError` changes. If you remove the check you might see
  // a warning like this:
  // Warning: Can't perform a React state update on an unmounted component.
  // This is a no-op, but it indicates a memory leak in your application.
  render(){
    // const { clientError } = this.props;
    // if (clientError !== null){
    //   return <div></div>
    // }
    return (
      <div className="box">
        {this.renderSearch()}
        <div className="columns">
          <div className="column ">
            <MemoizedInfoComponent {...this.state} />
          </div>
        </div>
          <MemoizedInfoViaHashesComponent {...this.state} onClickHash={this.getAndUpdateTxHash} />
          <MemoizedInfoInputOutputHashes 
            {...this.state}
            onClickHash={this.getAndUpdateTxHash}
          />
      </div>
      
    );
    
  }
}

const mapDispatchToProps = dispatch => {
	return {
    updateErrorState: (args) => {
      dispatch(updateErrorState(args));
    },
    updateTxHash: (args) => {
      dispatch(updateTxHash(args));
    },
  };
};

const mapStateToProps = state => {
	return {
    client: state.AppReducer.client,
    txHash: state.TxReducer.txHash,
		clientError: state.AppReducer.clientError,
  };
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TxInfo);
