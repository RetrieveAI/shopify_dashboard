import { Badge, Card, ChoiceList, Layout, Page, TextStyle, Button, FooterHelp, Link } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import useConfig from '../hooks/useConfig';

const Subscriptions = () => {

    const appConfig = useConfig();

    const [selected, setSelected] = useState(['hidden']);

    const handleSelection = useCallback((value) => setSelected(value), []);

    return (
        <Page title="Subscriptions">
            <Layout>
                <Layout.AnnotatedSection title="Billing" description="Select a different plan, click on Change Plan and approve the new subscription to change your plan.">
                    <Layout.Section>
                    <Card title="Your Plan" sectioned>
                    <TextStyle>Current Plan</TextStyle><br/>
                    <Badge status="success">Free</Badge><br/><br/>
                    <ChoiceList
                    title="Company name"
                    choices={[
                        {label: 'Free', value: 'hidden',  helpText:
                        'Free | 0 - 5,000 visitors per month',},
                        {label: 'Basic', value: 'optional',  helpText:
                        '$29.90 per month | 5,001 - 20,000 visitors per month',},
                        {label: 'Premium', value: 'required',  helpText:
                        '$99.90 per month | 20,001 - 100,000 visitors per month',},
                    ]}
                    selected={selected}
                    onChange={handleSelection}
                    /><br/>
                    <Button primary>Change Plan</Button>
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