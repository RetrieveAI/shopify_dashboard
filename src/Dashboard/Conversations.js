import { Card } from '@material-ui/core'
import { Layout, Page, Stack } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import {Bar} from 'react-chartjs-2';


const Conversations = ({data}) => {

    const [msgProcessedViewData, setMsgProcessedViewData] = useState([])
    const [userResponseViewData, setUserResponseViewData] = useState([])
    const [weekConversationViewData, setWeekConversationViewData] = useState([])

    const [msgProcessedData, setMsgProcessedData] = useState([])
    const [userResponseData, setUserResponseData] = useState([])
    const [weekConversationData, setWeekConversationData] = useState([])


    useEffect(() => {
        if(data && data.messages_processed){
            setMsgProcessedData(data.messages_processed);
        }
        if(data && data.user_responded_conversations){
            setUserResponseData(data.user_responded_conversations)
        }
        if(data && data.weekly_conversation){
            setWeekConversationData(data.weekly_conversation)
        }
    }, [data])
    

    const chart = () => {
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
                    label: 'User Response View',
                    data: weekConversationData,
                    backgroundColor: [ 'rgba(255, 159, 64, 1)' ],
                    borderWidth: 4
                }
            ],
            responsive: true,
        });
    }

    var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var monthName=months[d.getMonth()]; 

    const options = {
        plugins: {
              title: {
                display: true,
                text: monthName,
              },
              datalabels: {
                title: 'null'
              }
            },
      };


    useEffect(() => {
        chart()
    }, [msgProcessedData, userResponseData, weekConversationData])

    return (
        
          <Layout>
              <Layout.Section>
                  <Stack distribution="center">
                      <Card title="Visitors per week">
                        <Bar data={msgProcessedViewData} options={options}/>
                      </Card>
                      <Card title="Visitors per month">
                        <Bar data={userResponseViewData} options={options}/>
                      </Card>
                      <Card title="Visitors per month">
                        <Bar data={weekConversationViewData} options={options}/>
                      </Card>
                  </Stack>
              </Layout.Section>
          </Layout>
    
    )
}

export default Conversations
