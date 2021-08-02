import {
  Card,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { Layout, Page, Stack } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useConfig from "../hooks/useConfig";
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  monthView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  },
  dateFilter: {
    display: "flex",
    padding: "10px",
    justifyContent: "center",
  },
  dateText: {
    padding: "2px 5px",
    fontSize: "16px",
  },
  convText: {
    display: 'flex',
    padding: '10px 5px'
  },
  subHead: {
    fontSize: '12px',
    padding: '2px',
    color: '#6c6c6c'
  }
}));
const Visitors = ({ data }) => {
  const classes = useStyles();

  const appConfig = useConfig();

  let url = document.location.href;
  let params = (new URL(url)).searchParams;
  let originCookie = params.get('shop')
  console.log(originCookie);
  //console.log(originCookie);
  // const keyArr = appConfig.shopify.cookie.split('.')
  // let finalVal ="";
  // keyArr.forEach((i) => {
  //     finalVal = finalVal ? finalVal[i]: window[i]
  // })
  // console.log(finalVal);

  const year = (new Date()).getFullYear();
  const nYears = Array.from(new Array(20),( val, index) => index + year);


  const [visitorsData, setVisitorsData] = useState(null);
  const [years, setYears] = useState(nYears);
  const [months, setMonths] = useState([ "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August", 
  "September",
  "October",
  "November",
  "December",]);
  const [weeks, setWeeks] = useState(["week1", "week2", "week3", "week4", "week5"]);
  const [currentWeek, setCurrentWeek] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');


  const [weekViewData, setWeekViewData] = useState('');
  const [monthViewData, setMonthViewData] = useState('');
  const [msgProcessedViewData, setMsgProcessedViewData] = useState('')
  const [userResponseViewData, setUserResponseViewData] = useState('')
  const [weekConversationViewData, setWeekConversationViewData] = useState('')

  const [weekData, setWeekData] = useState('');
  const [monthData, setMonthData] = useState('');
  const [weekDays, setWeekDays] = useState([]);
  const [msgProcessedData, setMsgProcessedData] = useState('')
  const [userResponseData, setUserResponseData] = useState('')
  const [weekConversationData, setWeekConversationData] = useState('')


  useEffect(() => {
    fetchChartData() 
  },[])

//fetch the analytics data  
const fetchChartData = async () => {
    let api_url = `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.analytics}?shop=${originCookie}&year=${currentYear}&month=${currentMonth}&week=${currentWeek}`
    const result = await axios.get(
      api_url, {withCredentials: true}
    );
    //console.log(result);
    if(result.data){
        setVisitorsData(result.data);
      }
  };
  //console.log(visitorsData);

  
  const yearChange = (event) => {
    const selectYear = event.target.value;
    setCurrentYear(selectYear);
    if (selectYear) {
      fetchChartData()
      setMonthData(visitorsData.vistors_monthwise);
    }
    console.log(selectYear);
  };

  const weekChange = (event) => {
    const selectWeek = event.target.value;
    setCurrentWeek(selectWeek);
    if (selectWeek) {
      setWeekData(visitorsData.visitor_weekwise);
      fetchChartData()
    }
    //console.log(selectWeek);
  };
  

  const monthChange = (event) => {
    const selectMonth = event.target.value;
    setCurrentMonth(selectMonth);
    if (selectMonth) {
      setMsgProcessedData(visitorsData.messages_processed);
      setUserResponseData(visitorsData.user_responded_conversations);
      setWeekConversationData(visitorsData.weekly_conversation);
      fetchChartData()
    }
    // if (selectMonth) {
    //   setUserResponseData(visitorsData.user_responded_conversations);
    // }
    // if (selectMonth) {
    //   setWeekConversationData(visitorsData.weekly_conversation);
    // }
    //console.log(selectMonth);
  };
  //console.log(msgProcessedData);
  

  useEffect(() => {
    if (data && data.visitor_weekwise) {
      setWeekData(visitorsData.visitor_weekwise);
    }
    if (data && data.vistors_monthwise) {
      setMonthData(visitorsData.vistors_monthwise);
    }
    if (data && data.week_days) {
      setWeekDays(visitorsData.week_days);
    }
    if(data && data.messages_processed){
      setMsgProcessedData(visitorsData.messages_processed);
  }
  if(data && data.user_responded_conversations){
      setUserResponseData(visitorsData.user_responded_conversations)
  }
  if(data && data.weekly_conversation){
      setWeekConversationData(visitorsData.weekly_conversation)
  }
  }, [data]);

  const chart = () => {
    setWeekViewData({
      labels: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      datasets: [
        {
          label: "Visitors Weekwise",
          data: weekData,
          backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          borderWidth: 4,
        },
      ],
      responsive: true,
    });
//console.log(weekData);
    setMonthViewData({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Visitors per month",
          data: monthData,
          backgroundColor: ["rgba(255, 159, 64, 1)"],
          borderWidth: 4,
        },
      ],
      responsive: true,
    });
    setMsgProcessedViewData({
      labels: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      datasets: [
          {
              label: 'Messages Processed',
              data: msgProcessedData,
              backgroundColor: [ 'rgba(75, 192, 192, 0.6)' ],
              borderWidth: 4
          }
      ],
      responsive: true,
      
  });
  //console.log(msgProcessedViewData);
  setUserResponseViewData({
      labels: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      datasets: [
          {
              label: 'User Response View',
              data: userResponseData,
              backgroundColor: [ 'rgba(54, 162, 235, 1)' ],
              borderWidth: 4
          }
      ],
      responsive: true,
  });
  setWeekConversationViewData({
      labels: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      datasets: [
          {
              label: 'Week Conversation View',
              data: weekConversationData,
              backgroundColor: [ 'rgba(255, 159, 64, 1)' ],
              borderWidth: 4
          }
      ],
      responsive: true,
  });
  };

    const options = {
        maintainAspectRatio: false,
        ticks: {
          autoSkip: false
      },
      ChartDataLabels: {
        color: '#FFCE56'
      },
      plugins: {
        datalabels: {
          color: 'blue',
          labels: {
            title: {
              font: {
                weight: 'bold'
              }
            },
            value: {
              color: 'green'
            }
          }
        }
      }
    };

  useEffect(() => {
    chart();
  }, [weekData, monthData, msgProcessedData, userResponseData, weekConversationData]);
 
  //console.log(weekData, monthData);

  return (
    <Layout>
      <Layout.Section>
      <Typography variant="h5" component="h5" className={classes.convText}>Visitors</Typography>
        <div className={classes.dateFilter}>
          <Typography variant="h6" component="h6" className={classes.dateText}>
            Year
          </Typography>
          <select
            className={classes.options}
            
            defaultValue={monthData}
            onChange={yearChange}
          >
            <option value="0">Select Year</option>
            {years.map((nYear, index) =><option value={nYear}  key={index+'nY'}>{nYear}</option>)}
          </select>
          <Typography variant="h6" component="h6" className={classes.dateText}>
            Month
          </Typography>
           
          <select 
          className={classes.options}  
          defaultValue={msgProcessedData, userResponseData, weekConversationData}
          onChange={monthChange}
        >
          <option value="0">Select Month</option>
        {months.map((month, index) =><option value={month}  key={index+'m'}>{month}</option>)}
        </select>          
          
          <Typography variant="h6" component="h6" className={classes.dateText}>
            Week
          </Typography>
          <select
            className={classes.options}
            defaultValue={weekData}
            onChange={weekChange}
          >
            <option value="0">Select Week</option>
            {weeks.map((week, index) =><option value={week}  key={index+'w'}>{week}</option>)}
          </select>
        </div>
        <Stack distribution="center" style={{ justifyContent: "center" }}>
          <Card>
            <Bar data={weekViewData} height={150} width={330}/>
          </Card>
          <Card>
            <Bar data={monthViewData} height={150} width={330} options={options}/>
          </Card>
        </Stack>
      </Layout.Section>
      <Layout.Section>
      <Typography variant="h5" component="h5" className={classes.convText}>Conversations</Typography>
        <Stack distribution="center">
          <Card>
             <Bar data={weekConversationViewData} />
          </Card>
          <Card>
             <Bar data={msgProcessedViewData} /> 
          </Card>
          <Card>
             <Bar data={userResponseViewData} /> 
          </Card>
        </Stack>
      </Layout.Section>
    </Layout>
  );
};

export default Visitors;
