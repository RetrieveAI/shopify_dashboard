import { Badge, Card, ChoiceList, Layout, Page, TextStyle, Button, FooterHelp, Link } from '@shopify/polaris'
import React, { useCallback, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import useConfig from '../hooks/useConfig';
import { AppContext } from '../AppContext';

const Subscriptions = () => {

    const appConfig = useConfig();

    const {selectedState, setSelectedState, setIsBillingStatusRecevied} = useContext(AppContext)

    let url = document.location.href;
    let params = (new URL(url)).searchParams;
    let originCookie = params.get('shop')
    console.log(originCookie);

    // const [billingURL, setBillingURL] = useState('');

    // const [billingStatus, setBillingStatus] = useState(true);

    const [selected, setSelected] = useState([]);
    

    const handleChange = useCallback((value) => setSelected(value), []);

    // useEffect(async () => {

    //   }, [selected]);

    //console.log(selected);

    const TrialPlan = {label: 'Trial', value: 'Trial', helpText:
    'Free Trial for 14 days',};
    const BasicPlan = {label: 'Basic', value: 'Basic',  helpText:
    '$24.99 per month | Up to 5,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};
    const ProPlan = {label: 'Pro', value: 'Pro',  helpText:
    '$59.99 per month | Up to 50,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};
    const PremiumPlan = {label: 'Premium', value: 'Premium',  helpText:
    '$149.99 per month | Up to 2,00,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};

    const handleClick = () => {
        let result;
        console.log(selected);
        if(selected == 'Basic') {
            result = axios.get(
               `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=basic&price=24.99&shop=${originCookie}`
            ).then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
            })   
            } 
        if(selected == 'Pro') {
            result = axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=pro&price=59.99&shop=${originCookie}`)    
            .then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
            })    
        }
        if(selected == 'Premium') {
            result = axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=premium&price=149.99&shop=${originCookie}`)    
            .then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
            })       
        }
        console.log(selected);
    }

    console.log(selected);

    useEffect(async() => {
        const res = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?status=info&shop=${originCookie}`);
        console.log(res);
        setSelectedState(res.data);
        setTimeout(() => {
            setIsBillingStatusRecevied(true);
        }, 100);
      }, [])

      //console.log(selected);


      useEffect(async () => {
          if(selectedState.billing_current_status){
            setSelected([selectedState.billing_current_status])
          }
      }, [selectedState]);

    return (
        <Page title="Subscriptions">
            <Layout>
                <Layout.AnnotatedSection title="Billing" description="Select a different plan, click on Change Plan and approve the new subscription to change your plan.">
                    <Layout.Section>
                    <Card title="Your Plan" sectioned>
                    <TextStyle>Current Plan</TextStyle><br/>
                    <Badge status="success">{selectedState.display_status}</Badge><br/>
                    {selectedState.display_status == 'Expired' ? <TextStyle variation="strong">your current plan '{selectedState.billing_previous_status}' is Expired. Please Change to next plan</TextStyle> : null}<br/><br/>
                    <ChoiceList
                    title="Select any plan"
                    choices={[
                        {...TrialPlan,disabled:selectedState.billing_current_status && (selectedState.billing_current_status.includes('Basic') || selectedState.billing_current_status.includes('Pro') || selectedState.billing_current_status.includes('Premium')) },
                        {...BasicPlan,disabled: selectedState.billing_current_status && (selectedState.billing_current_status.includes('Pro') || selectedState.billing_current_status.includes('Premium')) },
                        {...ProPlan,disabled: selectedState.billing_current_status && (selectedState.billing_current_status.includes('Premium')) },
                        PremiumPlan,
                    ]}
                    selected={selected}
                    //error="Change your plan"
                    onChange={handleChange}
                    /><br/>
                    <Button primary onClick={() => 
                        {handleClick();
                        }
                        }>Change Plan</Button>
                    </Card>
                    </Layout.Section>
                </Layout.AnnotatedSection>
                <FooterHelp>
                    Need some help? Go to the {' '}
                    <Link external url={appConfig.shopify.contactUrl}>
                    Contact Us
                    </Link> | <Link external url={appConfig.shopify.privacyUrl}>
                    Privacy Policy
                    </Link>
                </FooterHelp>
            </Layout>
        </Page>
    )
}

export default Subscriptions