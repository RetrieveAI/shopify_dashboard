import { Badge, Card, ChoiceList, Layout, Page, Heading, TextStyle, Banner, Subheading, Button, FooterHelp, Link } from '@shopify/polaris'
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

    const [countStatus, setCountStatus] = useState('');

    const [showBanner, setShowBanner] = useState(false);


    const [selected, setSelected] = useState([]);

    const planLimits = {
        Trial: 1000,
        Basic: 5000,
        Pro: 50000,
        Premium: 200000
    }
    

    const handleChange = useCallback((value) => {
        return setSelected(value)
    },  []);

//condition for selected plan expiry and plan limit    
    useEffect(() => {
        console.log(planLimits[selected[0]], countStatus.current_month_visitors_count );
        if(selected[0] === countStatus.selected_plan && countStatus.billing_current_plan_status === "Expired" || countStatus.current_month_visitors_count > planLimits[selected[0]]){
            setShowBanner(true)
        }
        else setShowBanner(false)
      }, [selected, countStatus]);

      //console.log(selected[0]);
      

    //console.log(selected);

    const TrialPlan = {label: 'Free Trial', value: 'Trial', helpText:
    'Free Trial for 14 days | Up to 1000 Site Visitors | Sales, Support and Order Tracking Chats | AI Chat Interactions'};
    const BasicPlan = {label: 'Basic', value: 'Basic',  helpText:
    '$24.99 per month | Up to 5,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};
    const ProPlan = {label: 'Pro', value: 'Pro',  helpText:
    '$59.99 per month | Up to 50,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};
    const PremiumPlan = {label: 'Premium', value: 'Premium',  helpText:
    '$149.99 per month | Up to 200,000 Monthly Site Visitors | Unlimited Sales,Support and Order Tracking Chats | Unlimited AI Chat Interactions',};

//get the billing plan based on the click   
    const handleClick = () => {
        let result;
        console.log(selected);
        if(selected == 'Trial') {
            result = axios.get(
               `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=trial&price=0&shop=${originCookie}`
            ).then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
                }).catch((err) => {
                    console.log("Error", err.response.data);
                    setCountStatus(err.response.data);
                })  
            }
        if(selected == 'Basic') {
            result = axios.get(
               `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=basic&price=24.99&shop=${originCookie}`
            ).then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
                }).catch((err) => {
                    console.log("Error", err.response.data);
                    setCountStatus(err.response.data);
                })  
            }
        if(selected == 'Pro') {
            result = axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=pro&price=59.99&shop=${originCookie}`)    
            .then(res => {
                console.log(res.data);
                window.open(res.data, "_parent"); 
            }).catch((err) => {
                console.log("Error", err.response.data);
                setCountStatus(err.response.data);
            })    
        }
        if(selected == 'Premium') {
            result = axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?billingstate=premium&price=149.99&shop=${originCookie}`)    
            .then(res => {
                console.log(res.data);
                window.open(res.data, "_parent");
            }).catch((err) => {
                console.log("Error", err.response.data);
                setCountStatus(err.response.data);
            })        
        }
        console.log(selected);
    }

    //console.log(countStatus.text);
    
//get the billing status
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
          if(selectedState.billing_current_plan){
            setSelected([selectedState.billing_current_plan])
          }
          if(selectedState.billing_current_plan_status === "Expired"){
            setSelected([selectedState.billing_current_plan])
          }
      }, [selectedState]);
      

    return (
        <Page title="Subscriptions">
            <Layout>
                <Layout.AnnotatedSection title="Billing" description="Select a different plan, click on Change Plan and approve the new subscription to change your plan.">
                    <Layout.Section>
                    <Card title="Plans" sectioned>
                    <Heading element="h3">Current Plan</Heading>
                    {selectedState.billing_current_plan_status === 'Expired' ? <Badge status="warning"><Heading element="h4">{selectedState.billing_plan_description}</Heading></Badge> : <Badge status="success"><Heading element="h4">{selectedState.billing_plan_description}</Heading></Badge>}<br/>
                    {selectedState.billing_current_plan_status === 'Expired' ? <TextStyle variation="strong">Your current plan '{selectedState.billing_current_plan}' is Expired. Please choose a different plan:</TextStyle> : null}<br/><br/>
                    <ChoiceList
                    title="Select a plan"
                    choices={[
                        {...TrialPlan,},
                        {...BasicPlan, },
                        {...ProPlan},
                        {...PremiumPlan},
                    ]}
                    selected={selected}
                    //error="Change your plan"
                    onChange={handleChange}
                    /><br/>
                   { showBanner ? <Banner
                        title={countStatus.text}
                        status="warning"
                        /> : null}<br/>
                    <Button primary disabled={selected[0] === selectedState.billing_current_plan || showBanner} onClick={() => {handleClick();}}>Change Plan</Button>
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