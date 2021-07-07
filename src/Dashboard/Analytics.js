import { makeStyles, Typography } from '@material-ui/core'
import { Badge, Card, Page, Tabs } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'
import Visitors from './Visitors';
import Conversations from './Conversations';
import useConfig from '../hooks/useConfig';


const useStyles = makeStyles((theme) => ({
    salesValue: {
        display: 'flex',
        height: '40px',
        width: '60px',
    },
    chartHeading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5px'
    }
}))

const Analytics = (props) => {
    const classes = useStyles()

    
  var nowDate = new Date(); 
  var date = nowDate.getDate()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getFullYear(); 


    return (
        <Page title="Analytics">
          <Typography variant="h4" component="h4" className={classes.chartHeading}>Reports as of &nbsp;<Badge status="success">{date}</Badge></Typography>
          <Card>
            <Card.Section>
            <Visitors/>
            </Card.Section>
        </Card>
        </Page>
    )
}

export default Analytics
