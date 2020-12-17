import React, { useEffect, useState } from 'react';
import {
  Table, Tabs, Button, PageHeader,
} from 'antd';
import { ethers } from 'ethers';
import { ReloadOutlined } from '@ant-design/icons';
import indexes from '../../utils/tellor/indexes';
import TELLOR_ADDRS from '../../utils/tellor/addrs';
import { medianAt } from '../../utils/helpers';
import columns from './columns';
import styles from '../../styles/Home.module.css';

const { TabPane } = Tabs;

const MAX_TIMESTAMPS_TO_RETRIEVE = 5;
const GRANULARITY = 1000000;
let tellorContract;

const INFURA_PROJECT_ID = process.env.NEXT_APP_INFURA_PROJECT_ID || 'ac734d77ecd944818d068489efa4758e'; // Replace by yours

const Dashboard = ({ DataPoints = [] }) => {
  // console.log('Dashboard data points', DataPoints);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [network, setNetwork] = useState('oracle');
  const [networkType, setNetworkType] = useState('homestead');

  const initTellor = (async (address, n) => {
    console.log('initTellor', address, n);
    const infuraProvider = new ethers.providers.InfuraProvider(n, INFURA_PROJECT_ID);
    const abi = [
      'function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint)',
      'function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 index) public view returns(uint256)',
      'function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256)',
    ];
    tellorContract = new ethers.Contract(
      address,
      abi,
      infuraProvider,
    );
  });

  const fetchDataPoint = async (tellorId) => {
    if (!tellorId) return console.error('Cannot fetch a data point witout its Tellor id');
    if (!tellorContract) return console.error('No tellorPlayground instance found');

    const count = await tellorContract.getNewValueCountbyRequestId(tellorId);
    if (!count || count.toString() === '0') return null;
    const values = [];
    const start = (count - MAX_TIMESTAMPS_TO_RETRIEVE) > 0
      ? (count - MAX_TIMESTAMPS_TO_RETRIEVE) : 0;
    for (let idx = start; idx < count; ++idx) {
      // eslint-disable-next-line no-await-in-loop
      const ts = await tellorContract.getTimestampbyRequestIDandIndex(tellorId, idx);
      // eslint-disable-next-line no-await-in-loop
      const value = await tellorContract.retrieveData(tellorId, ts);
      const transformedValue = tellorId < indexes.length
        ? (parseFloat(value.toString()) / GRANULARITY) : parseFloat(value.toString());
      values.push({ idx, ts, value: transformedValue });
    }
    const lastItem = values.slice(-1)[0];
    return ({
      tellorId, count, values, lastValue: lastItem ? lastItem.value : 0,
    });
  };

  const fetchDataPoints = async () => {
    const promises = DataPoints.map((dp) => fetchDataPoint(dp));
    const results = await Promise.allSettled(promises);
    const newDataSource = [];
    results
      .filter(({ status, value }) => status === 'fulfilled' && value !== null)
      .forEach(({
        value: {
          tellorId, count, values, lastValue,
        },
      }, idx) => {
        const flatValues = values.map(({ value }) => value);
        newDataSource.push({
          tellorId,
          name: tellorId < indexes.length ? indexes[idx] : 'N/A',
          key: tellorId,
          dataPoint: tellorId,
          data: lastValue,
          count: count.toString(),
          chart: values,
          median: medianAt(flatValues),
          avg: flatValues.reduce((acc, cur) => acc + cur, 0) / flatValues.length,
        });
      });
    setDataSource(newDataSource);
    setLoading(false);
  };

  const init = async (n, t) => {
    console.log(`Using network ${n} and networkType ${t}`);
    const addr = TELLOR_ADDRS[n][t];
    await initTellor(addr, t);
    await fetchDataPoints();
  };

  useEffect(() => {
    init(network, networkType);
  }, [DataPoints]);

  const onChange = async (key) => {
    if (!loading) setLoading(true);
    const [n, t] = key.split('-');
    setNetwork(n);
    setNetworkType(t);
    await init(n, t);
  };

  const onClick = async () => {
    if (!loading) setLoading(true);
    await fetchDataPoints();
  };

  return (
    <main className={styles.main}>
      <PageHeader
        onBack={() => {}}
        title="Tellor Walker"
        subTitle="Data Points Visualizer for tellor.io"
        backIcon={false}
      />
      <Tabs defaultActiveKey="oracle-homestead" onChange={onChange} size="large" centered>
        <TabPane tab="Oracle::Mainnet" key="oracle-homestead" tabBarStyle={{ fontWeight: 'bold' }}>
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
        <TabPane tab="Oracle::Rinkeby" key="oracle-rinkeby" tabBarStyle={{ fontWeight: 'bold' }}>
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
        <TabPane tab="Playground::Rinkeby" key="playground-rinkeby">
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
        <TabPane tab="Playground::Kovan" key="playground-kovan">
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
        <TabPane tab="Playground::Ropsten" key="playground-ropsten">
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
        <TabPane tab="Playground::Goerli" key="playground-goerli">
          <Table dataSource={dataSource} columns={columns} size="large" loading={loading} />
        </TabPane>
      </Tabs>
      <Button
        size="small"
        type="primary"
        icon={<ReloadOutlined />}
        shape="circle"
        onClick={onClick}
        loading={loading}
        style={{ marginBottom: 15 }}
      />
    </main>
  );
};

export default Dashboard;
