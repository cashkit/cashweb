import React, { lazy, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { ErrorBoundary } from '../../common';
import { checkClient } from '../../redux';
import { InfoBar } from '../../common';
import { useDispatch } from 'react-redux';

import Navigation from './navigation';
const NodeInfo = lazy(() => import("../../containers/nodeinfo"));
const LiveTransactions = lazy(() => import("../../containers/livetransactions"));
const BlockInfo = lazy(() => import("../../containers/blockinfo"));
const TxInfo = lazy(() => import("../../containers/txn"));
const AddressInfo = lazy(() => import("../../containers/address"));

enum Sections {
  NODE_INFO = 0,
  LIVE_TRANSACTIONS = 1,
  BLOCK_INFO = 2,
  TRANSACTION_INFO = 3,
  ADDRESS_INFO = 4
}

const Landing = () => {
  const [ currentSection, setSection ] = useState(Sections.NODE_INFO)
  const txInfoRef = useRef<any>(null);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkClient())
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    
  // eslint-disable-next-line
  }, [currentSection])

  /**
   * Usage:
   *  <Profiler id="TxInfo" onRender={this.onRenderProfilerCallback}>
   *      <Component/>
   * </Profile>
   * 
   * @param id - the "id" prop of the Profiler tree that has just committed.
   * @param phase - either "mount" (if the tree just mounted) or "update" (if it re-rendered).
   * @param actualDuration - time spent rendering the committed update
   * @param baseDuration - estimated time to render the entire subtree without memoization
   * @param startTime - when React began rendering this update
   * @param commitTime - when React committed this update
   * @param interactions - the Set of interactions belonging to this update
   */
  const onRenderProfilerCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
    console.log(`[INFO] PROFILER: ID: ${id}
      PHASE: ${phase}
      ACTUAL_DURATION: ${actualDuration}, 
      BASE_DURATION: ${baseDuration}
      START_TIME: ${startTime}
      COMMIT_TIME: ${commitTime}
      INTERACTIONS: ${interactions.size}`
    )
  }

  const onTxClick = (ref) => {
    setSection(Sections.TRANSACTION_INFO)
    // ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const setCurrentSection = (arg) => {
    if (arg != currentSection){
      setSection(arg)
    }
  }

  const renderNodeInfo = () => {
    if (currentSection == Sections.NODE_INFO) {
      return (
        <div className="section visibility: hidden;">            
          <ErrorBoundary>
            <NodeInfo/>
          </ErrorBoundary>
        </div>
      )
    }
    return undefined
  }

  const renderLiveTransactions = () => {
    const hidden = currentSection != Sections.LIVE_TRANSACTIONS
      return (
        <div className="section hidden">            
          <ErrorBoundary>
            <LiveTransactions hidden={hidden} onTxClick={() => onTxClick(txInfoRef)}/>
          </ErrorBoundary>
        </div>
      )
  }

  const renderBlockInfo = () => {
    if (currentSection == Sections.BLOCK_INFO) {
      return (
        <div className="section">            
          <ErrorBoundary>
            <BlockInfo/>
          </ErrorBoundary>
        </div>
      )
    }
    return undefined
  }

  const renderTxInfo = () => {
    if (currentSection == Sections.TRANSACTION_INFO) {
      return (
        <div className="section" ref={txInfoRef}>            
          <ErrorBoundary>
            <TxInfo/>
          </ErrorBoundary>
        </div>
      )
    }
    return undefined
  }

  const renderAddressInfo = () => {
    if (currentSection == Sections.ADDRESS_INFO) {
      return (
        <div className="section">            
          <ErrorBoundary>
            <AddressInfo/>
          </ErrorBoundary>
        </div>
      )
    }
    return undefined
  }
  
  return (
    <div className="App">
        <Helmet
          titleTemplate="%s - CashWeb"
          defaultTitle="CashWeb"
        >
          <meta name="description" content="Dashboard: A CashWeb application" />
        </Helmet>
        <InfoBar/>
        <div className="columns">
          
          <div className="column is-2">
            <Navigation setCurrentSection={(arg) => setCurrentSection(arg)}/>
          </div>
          
          <div className="column">
            {renderNodeInfo()}
            {renderBlockInfo()}
            {renderTxInfo()}
            {renderAddressInfo()}
            {renderLiveTransactions()}
          </div>
        </div>
        
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              <strong>Cashkit</strong> by <a href="https://github.com/kiok46">Kuldeep</a>. The source code is licensed
              <a href="http://opensource.org/licenses/mit-license.php"> MIT</a>.
            </p>
          </div>
        </footer>
    </div>
  )
}

export default Landing