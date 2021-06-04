import { makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Badge, Button, Card, Collapsible, FooterHelp, Heading, Layout, Link, Page, SettingToggle, Stack, TextContainer, TextStyle } from '@shopify/polaris'
import '@shopify/polaris/dist/styles.css';
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import useConfig from '../hooks/useConfig';

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

    const [active, setActive] = useState(true);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isStatusRecevied, setIsStatusReceived] = useState(false);


    const handleDropDown = useCallback(() => setOpen((open) => !open), []);

    const handleMenuOpen = useCallback(() => setMenuOpen((menuOpen) => !menuOpen), [])

    const handleToggle = useCallback(() => setActive((active) => !active), []);

    useEffect(async () => {
        if(isStatusRecevied) {
            let result;
        if(active) {
            result = await axios(
                `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?state=activate`
              );
        } else {
            result = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?state=deactivate`);     
        }
        }
      }, [active]);

      useEffect(async() => {
        const res = await axios(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.resource}?status=info`);
        //console.log(res);
        setActive(res.data == 'active');
        setTimeout(() => {
            setIsStatusReceived(true);
        }, 100);
      }, [])

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
                                    👋   Welcome to SleekBuys <span className={classes.arrow}><ExpandMore fontSize="large"/></span>
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
                                        RetrieveAI enables organizations worldwide to compete more effectively by providing artificial intelligence solutions.
                                        We develop interactive web applications and tools using different Artificial Intelligence models to explore various types
                                        of data and create successful business stories that will contribute towards faster and efficient decision-making.
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
                                🚀   Use the pre-launch chatbot feature to build buzz <span className={classes.arrow}><ExpandMore fontSize="large"/></span>
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
                                        <p>
                                        RetrieveAI enables organizations worldwide to compete more effectively by providing artificial intelligence solutions.
                                        We develop interactive web applications and tools using different Artificial Intelligence models to explore various types
                                        of data and create successful business stories that will contribute towards faster and efficient decision-making.
                                        </p>
                                    </TextContainer>
                                    </Layout.Section>
                                </Collapsible>
                        </Card>
                    </Layout.Section>
                    <Layout.AnnotatedSection title="Install the SleekBuys App"
                        description="SleekBuys is the easiest way to sell your products in person.">
                        <Layout.Section>
                        <SettingToggle
                        action={{
                        content: contentStatus,
                        onClick: handleToggle,
                        }}
                        enabled={active}
                        >
                        Your SleekBuys Chat is <TextStyle variation="strong">{textStatus}</TextStyle>.
                        </SettingToggle>
                        </Layout.Section>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection>

                    </Layout.AnnotatedSection>
                </Layout><br/><br/>
                <FooterHelp>
                    Need some help? Go to the {' '}
                    <Link external url="https://retrieveai.com">
                    Contact Us
                    </Link> | <Link external url="https://retrieveai.com">
                    Privacy Policy
                    </Link>
                </FooterHelp>
            </Page>
        </div>
    )
}

export default DashBoard
