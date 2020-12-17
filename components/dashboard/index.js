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

const { TabPane } = Tabs;

const MAX_TIMESTAMPS_TO_RETRIEVE = 5;
const GRANULARITY = 1000000;
let tellorContract;

const Dashboard = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  const initTellor = (async (address, network) => {
    console.log('initTellor', address, network);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const infuraProvider = new ethers.providers.InfuraProvider(network, '931d4c1f23114993a7f4eeac8a7922fb');
    const abi = [
      'function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint)',
      'function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 index) public view returns(uint256)',
      'function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256)',
    ];
    tellorContract = new ethers.Contract(
      address,
      abi,
      infuraProvider, // or provider.getSigner(0)
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
      // console.log('value =>', value.toString())
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
    // const dataPoints = [1, 2019];  // ETHUSD (official) and COVID19 (unofficial)
    // const dataPoints = [1, 2, 3, 4, 5];  // ETHUSD, BTCUSD, BNB/USD, BTC/USD 24h, ETH/BTC
    const dataPoints = [];
    for (let p = 0; p < indexes.length; ++p) {
      dataPoints.push(p + 1);
    }
    dataPoints.push(2019); // COVID19 tracker
    const promises = dataPoints.map((dp) => fetchDataPoint(dp));
    const results = await Promise.allSettled(promises);
    const newDataSource = [];
    results
      .filter(({ status, value }) => status === 'fulfilled' && value !== null)
      .forEach(({
        value: {
          tellorId, count, values, lastValue,
        },
      }, idx) => {
        // console.log('values',  lastValue);
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
    // console.log('newDataSource', newDataSource);
    setDataSource(newDataSource);
    setLoading(false);
  };

  const init = async (network = 'oracle', networkType = 'homestead') => {
    console.log('Using network', network);
    console.log('Using networkType', networkType);
    const addr = TELLOR_ADDRS[network][networkType];
    await initTellor(addr, networkType);
    await fetchDataPoints();
  };

  useEffect(() => {
    init();
  }, []);

  const onChange = async (key) => {
    if (!loading) setLoading(true);
    const [network, networkType] = key.split('-');
    await init(network, networkType);
  };

  const onClick = async () => {
    if (!loading) setLoading(true);
    await fetchDataPoints();
  };

  return (
    <>
      <PageHeader
        onBack={() => {}}
        title="Tellor.io"
        subTitle="Data Points Visualizer"
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
    </>
  );
};

export default Dashboard;
