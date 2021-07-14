import { makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Badge, Button, Card, Collapsible, FooterHelp, Heading, Layout, Link, Page, SettingToggle, Stack, TextContainer, TextStyle } from '@shopify/polaris'
import '@shopify/polaris/dist/styles.css';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import useConfig from '../hooks/useConfig';
import { AppContext } from '../AppContext';

const useStyles = makeStyles((theme) => ({
    intro: {
        width: '70%',
        margin: 'auto'
    },
    arrow: {
        position: 'absolute',
        top: '4px'
    }
  }));

const DashBoard = () => {
    const classes = useStyles()

    const appConfig = useConfig();

    const {setSelectedState, selectedState} = useContext(AppContext);


    const [active, setActive] = useState(true);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isStatusRecevied, setIsStatusReceived] = useState(false);


    const handleDropDown = useCallback(() => setOpen((open) => !open), []);

    const handleMenuOpen = useCallback(() => setMenuOpen((menuOpen) => !menuOpen), [])

    const handleToggle = useCallback(() => setActive((active) => !active), []);

    let url = document.location.href;
    let params = (new URL(url)).searchParams;
    let originCookie = params.get('shop')
    let charge_id = params.get('charge_id')
    console.log(originCookie);
    console.log(charge_id);
    // const keyArr = appConfig.shopify.cookie.split('.')
    // let finalVal ="";
    // keyArr.forEach((i) => {
    //     finalVal = finalVal ? finalVal[i]: window[i]
    // })
    //console.log(originCookie);

    useEffect(async() => {
        if(charge_id !== 'null' ){
        const res = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?charge_id=${charge_id}&shop=${originCookie}`);
        console.log(res);
        }
      }, [])

      useEffect(async() => {
        const res = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.billing}?status=info&shop=${originCookie}`);
        console.log(res);
        setSelectedState(res.data);
      }, [])
      
      useEffect(async() => {
          let result;
        if(selectedState.billing_current_status === 'Expired'){
            result = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?state=deactivate&shop=${originCookie}`);     
        }
      },[selectedState])


      useEffect(async() => {
        const res = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?status=info&shop=${originCookie}`);
        console.log(res);
        setActive(res.data == 'active');
        setTimeout(() => {
            setIsStatusReceived(true);
        }, 100);
      }, [])

         
    useEffect(async () => {
        if(isStatusRecevied) {
            let result;
        if(active) {
            result = await axios(
                `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?state=activate&shop=${originCookie}`
              );
        }else{
            result = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?state=deactivate&shop=${originCookie}`);     
        }
        }
      }, [active]);
    //console.log(active);


    const contentStatus = active ? 'Deactivate' : 'Activate';
    const textStatus = active ? 'activated' : 'deactivated';

    return (
        <div>
            <Page 
            title="Dashboard"
            subtitle="Your Quick Start Guide"
            >
                <Layout>
                    <Layout.Section>
                        <Card sectioned className={classes.intro}>
                            <Stack distribution="equalSpacing">
                            <Button plain outline={false} monochrome={true} removeUnderline={true} onClick={handleDropDown}
            ariaExpanded={open}
            ariaControls="basic-collapsible">
                                <Heading>
                                    👋   Welcome to SleekChats <span className={classes.arrow}><ExpandMore fontSize="large"/></span>
                                </Heading>
                                </Button>
                                <Badge>Overview</Badge>
                            </Stack>
                            <Collapsible 
                                open={open}
                                id="basic-collapsible"
                                transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                                expandOnPrint
                                >
                                    <Layout.Section>
                                    <TextContainer>
                                    <p>
                                        SleekChats app helps you deliver value to the customers by intelligently chatting with them and provide items in real time from your store 24/7. This life like experience will enhance customer experience and elevate sales of your store.
                                        </p>
                                    </TextContainer>
                                    </Layout.Section>
                                </Collapsible>
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <Card sectioned className={classes.intro}>
                            <Stack distribution="equalSpacing">
                            <Button plain outline={false} monochrome={true} removeUnderline={true} onClick={handleMenuOpen}
            ariaExpanded={menuOpen}
            ariaControls="menu-collapsible">
                                <Heading>
                                🚀   We are excited to share few details on how our app works <span className={classes.arrow}><ExpandMore fontSize="large"/></span>
                                </Heading>
                                </Button>
                                <Badge>Overview</Badge>
                            </Stack>
                            <Collapsible 
                                open={menuOpen}
                                id="menu-collapsible"
                                transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                                expandOnPrint
                                >
                                    <Layout.Section>
                                    <TextContainer>
                                    <ul>
                                            <li>
                                            AI Based chat functionality with powerful natural language processing to understand the customers requirement and reply back to them.
                                            </li>
                                            <li>
                                            Automatically detect key words and phrases to make accurate suggestions
                                            </li>
                                            <li>
                                            Drive the sales with human like experience through out the conversation
                                            </li>
                                            <li>
                                            Session management to continuously engage with customers and wait for their responses
                                            </li>
                                            <li>
                                            Welcome and greeting message to kick start the conversation
                                            </li>
                                        </ul>
                                    </TextContainer>
                                    </Layout.Section>
                                </Collapsible>
                        </Card>
                    </Layout.Section>
                    { selectedState.billing_current_status === 'Expired' ? <Layout.AnnotatedSection title="Your current plan is expired."
                        description="Please change the plan to reactivate the chat widget">
                            <Layout.Section>
                        <SettingToggle
                        action={{
                        content: contentStatus,
                        onClick: handleToggle,
                        disabled: true
                        }}
                        >
                        Your SleekChats is <TextStyle variation="strong">deactivated</TextStyle>.
                        </SettingToggle>
                        </Layout.Section>
                    </Layout.AnnotatedSection> : <Layout.AnnotatedSection
                        description="SleekChats is the easiest way to sell your products in person.">
                        <Layout.Section>
                        <SettingToggle
                        action={{
                        content: contentStatus,
                        onClick: handleToggle,
                        }}
                        enabled={active}
                        >
                        Your SleekChats is <TextStyle variation="strong">{textStatus}</TextStyle>.
                        </SettingToggle>
                        </Layout.Section>
                    </Layout.AnnotatedSection>
                        }
                    <Layout.AnnotatedSection>
                            
                    </Layout.AnnotatedSection>
                </Layout><br/><br/>
                <FooterHelp>
                    Need some help? Go to the {' '}
                    <Link external url={appConfig.shopify.contactUrl}>
                    Contact Us
                    </Link> | <Link external url={appConfig.shopify.privacyUrl}>
                    Privacy Policy
                    </Link>
                </FooterHelp>
            </Page>
        </div>
    )
}

export default DashBoard
