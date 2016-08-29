import React from 'react';
import styles from './rootStyle.css';

const Root = React.createClass({
    render() {
        return (
            <div className={styles.main}>
                <div className={styles.rootContainer}>
                    { this.props.children }
                    </div>
            </div>
    );
    }
});

export default Root