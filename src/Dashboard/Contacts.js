import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core';
import { Avatar, Badge, Card, Page, ResourceItem, ResourceList, Spinner, Stack, TextStyle } from '@shopify/polaris';
import axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react'
import useConfig from '../hooks/useConfig';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    heading: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: theme.typography.fontWeightRegular,
    }
})) 

const Contacts = () => {
    const classes = useStyles()

    const appConfig = useConfig();

    let url = document.location.href;
    let params = (new URL(url)).searchParams;
    let originCookie = params.get('shop')
    console.log(originCookie);

    //let originCookie = document.location.origin;
    // console.log(originCookie);
    // const keyArr = appConfig.shopify.cookie.split('.')
    // let finalVal ="";
    // keyArr.forEach((i) => {
    //     finalVal = finalVal ? finalVal[i]: window[i]
    // })
    console.log(originCookie);

    const [contactsData, setContactsData] = useState([])

    const [load, setLoad] = useState(true)
    

    useEffect(() => {
        fetchContactsData()
    },[])

//Fetch contacts api data
    const fetchContactsData = async () => {
        let api_url = `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.cust}?shop=${originCookie}`
        const result = await axios.get(
          api_url, {withCredentials: true}
        );
        console.log(result.data);
        if(result.data.customers ){
            setContactsData(result.data.customers)
            setLoad(false)
          }
      }; 

      if(!contactsData.length) return <h2>No Data</h2>;

//used shopify polaris components
    return (
        <Page title="Contacts">
            <Stack>
            <Card>
                {load ? <Card sectioned>No Data</Card> : <>
                {contactsData.map((customerData, index) =>
                {return (
                <div className={classes.root} key={index}>
                    <Accordion>
                         <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Stack style={{alignItems:"center"}} distribution="equalSpacing">
                            <Stack.Item>
                            <Avatar/>
                            </Stack.Item>
                            <Stack.Item fill>
                            <Typography variant="h2" component="h2" className={classes.heading}>{typeof customerData.first_name !== "undefined" ? customerData.first_name : "No Data"}</Typography>
                            </Stack.Item>
                            <Stack.Item>
                            { typeof customerData.orders_count !== "undefined" ? <Badge status="success">Orders Count: {customerData.orders_count}</Badge> : <Badge status="info">Orders Count: {customerData.orders_count}</Badge>}
                            </Stack.Item>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Card>
                        <Card.Section title="First Name">
                            <Card.Subsection>{typeof customerData.first_name !== "undefined" ? customerData.first_name : "No Data"}</Card.Subsection>
                        </Card.Section>
                        <Card.Section title="Last Name">
                            <Card.Subsection>{typeof customerData.last_name !== "undefined" ? customerData.last_name : "No Data"}</Card.Subsection>
                        </Card.Section>
                        <Card.Section title="Addresses">
                         <div>
                          <Card.Subsection>{typeof customerData.default_address !== "undefined" ? customerData.default_address.address1 : "No Address"}</Card.Subsection>
                          <Card.Subsection>{typeof customerData.default_address !== "undefined" ? customerData.default_address.city: "No City"}</Card.Subsection> 
                          <Card.Subsection>{typeof customerData.default_address !== "undefined" ? customerData.default_address.zip : "No Zip"}</Card.Subsection> 
                        </div>
                        </Card.Section> 
                        <Card.Section title="Email">
                            <Card.Subsection>
                            {typeof customerData.email !== "undefined" ? customerData.email : "No Data"}
                            </Card.Subsection>
                        </Card.Section>
                        <Card.Section title="Phone">
                            <Card.Subsection>
                            {typeof customerData.phone !== "undefined" ? customerData.phone : "No Data"}
                            </Card.Subsection>
                        </Card.Section>
                        </Card>
                        </AccordionDetails>
                    </Accordion>
                </div>
                )})}
                </>}
            </Card>
            </Stack>
        </Page>
    )
}

export default Contacts
