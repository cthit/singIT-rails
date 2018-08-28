import React from 'react';
import styles from './rootStyle.css';
import { hot } from 'react-hot-loader'
import Start from './components/start';


const App = () => (
    <div className={styles.main}>
        <div className={styles.rootContainer}>
            <Start/>
        </div>
    </div>
);

export default hot(module)(App)