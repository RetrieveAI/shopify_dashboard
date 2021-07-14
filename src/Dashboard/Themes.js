import { Icon, Layout, Page, SettingToggle, TextStyle } from "@shopify/polaris";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import useConfig from "../hooks/useConfig";
import { HintMajor } from "@shopify/polaris-icons";
import { Brightness3Outlined, WbSunnyOutlined } from "@material-ui/icons";
import { Switch } from "@material-ui/core";

const Themes = () => {
  const appConfig = useConfig();

  const [activeTheme, setActiveTheme] = useState('light');
  const [isThemeStatusRecevied, setIsThemeStatusReceived] = useState(false);

  const handleToggle = useCallback(
    () => setActiveTheme((activeTheme) => activeTheme == 'light' ? 'dark' : 'light'),
    []
  );

  let url = document.location.href;
  let params = (new URL(url)).searchParams;
  let originCookie = params.get('shop')
  console.log(originCookie);
  // //console.log(originCookie);
  // const keyArr = appConfig.shopify.cookie.split('.')
  // let finalVal ="";
  // keyArr.forEach((i) => {
  //     finalVal = finalVal ? finalVal[i]: window[i]
  // })
  // console.log(finalVal);

  useEffect(async () => {
    if (!isThemeStatusRecevied) {
      setIsThemeStatusReceived(true);
    } else {
      let result;
      if (activeTheme == 'light') {
        result = await axios(
          `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.themes}?state=light&shop=${originCookie}`
        );
      } else {
        result = await axios(
          `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.themes}?state=dark&shop=${originCookie}`
        );
      }
    }
  }, [activeTheme]);

  useEffect(async () => {
    const res = await axios(
      `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.themes}?status=check&shop=${originCookie}`
    );
    //console.log(res);
    setActiveTheme(res.data);
  }, []);

  //console.log(activeTheme);

  const contentStatus = activeTheme == 'light' ? (
    <Brightness3Outlined />
  ) : (
    <WbSunnyOutlined />
  );
  const textStatus = activeTheme == 'light' ? "Light" : "Dark";

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Change your Widget Theme"
          description="SleekChats providing you the Light and Dark Theme"
        >
          <Layout.Section>
            <SettingToggle
              action={{
                content: contentStatus,
                onClick: handleToggle,
              }}
              enabled={activeTheme}
            >
              Your SleekChats Theme is{" "}
              <TextStyle variation="strong">{textStatus}</TextStyle>.
            </SettingToggle>
          </Layout.Section>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
};

export default Themes;
