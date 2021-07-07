import { Button, makeStyles, Typography } from '@material-ui/core';
import { Avatar, Badge, Card, Heading, Layout, Page, ResourceItem, ResourceList, Stack, TextStyle } from '@shopify/polaris'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import useConfig from '../hooks/useConfig';
import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import clsx from  'clsx';
import ProductCard from './components/ProductCard';

const pageDataMap = new Map()

const useStyles = makeStyles((theme) => ({
    convoList: {
        display: 'flex',
        padding: '10px',
        margin: '5px',
        //border: '1px solid #333',
        boxShadow: '0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15)',
        cursor: 'pointer',
        backgroundColor: '#eee'
    },
    cardView: {
        display: 'flex'
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
    },
    pagination: {
        display: 'inline-flex',
        width: '100%',
        overflowX: 'auto',
        justifyContent: 'center'
    },
    pageNumber: {
        display: 'block',
        border: '1px solid #ddd',
        padding: '2px 5px',
        cursor: 'pointer',
        justifyContent: 'center',
        margin: '10px 4px'
    },
    disable: {
        opacity: '0.4',
        pointerEvents: 'none'
    },
    userActive: {
        backgroundColor: '#fff',
        cursor: 'default',
        pointerEvents: 'none'
    }
}))

const Inbox = () => {
    const classes = useStyles()

    const appConfig = useConfig();

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

    const [convoList, setConvoList] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);

    const [pageSize, setPageSize] = useState(5);

    const [selectedUser, setSelectedUser] = useState(null);

    const [selectedConv, setSelectedConv] = useState({userIndex: null, content: null});

    const [currentUsers, setCurrentUsers] = useState([]);

    const [allConvos, setAllConvos] = useState([]);

    const [productItems, setProductItems] = useState([]);


    useEffect(() => {
        fetchCustomerData()
    }, [])

    useEffect(() => {
        console.log(selectedConv);
    }, [selectedConv])

    useEffect(() => {
       if(!allConvos.length && convoList.length){
           fetchConvo(0)
       }
    }, [convoList])

    useEffect(() => {
        if(convoList.length){
            setCurrentUsers(convoList.slice((pageNumber-1)*pageSize, pageNumber*pageSize))
            handleUserClick((pageNumber-1)*pageSize)
        }
    }, [pageNumber])

    const handleUserClick = (userIndex) => {
        setSelectedUser(userIndex)
        const userChat = allConvos.filter(conv => conv.userIndex == userIndex)
        //console.log(userChat);
        if(userChat && userChat.length){
            setSelectedConv(userChat[0])
        } else {
            fetchConvo(userIndex)
        }
    }

    const isSelectedUser = (index) => {
        return selectedUser == (pageNumber-1)*pageSize+index
    }

    const fetchConvo = async (userIndex) => {
        setSelectedUser(userIndex)
        const result = await axios.get(`${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.convo}?shop=${originCookie}&session_id=${convoList[userIndex].session_id}`, {withCredentials: true});
        setSelectedConv({userIndex, content: result.data});
        setAllConvos([...allConvos, {userIndex, content: result.data}])

        if(result.data) {
            result.data.forEach((chat) => {
                if(chat.user) {

                } else {
                    if(chat.bot.items) {
                        setProductItems([...productItems, JSON.parse(chat.bot.items)])
                    }
                }
            })
        }
    }

    const fetchCustomerData = async () => {
        let api_url = `${appConfig.shopify.endpoint}${appConfig.shopify.envpath}${appConfig.shopify.convo}?shop=${originCookie}`
        const result = await axios.get(
          api_url, {withCredentials: true}
        );
        //console.log(result);
        if(result.data.customer_data ){
            setConvoList(result.data.customer_data)
            setCurrentUsers(result.data.customer_data.slice(0, pageSize))
          }
      }; 

    const getProductItem = (productId) => {
        const product = productItems.filter(item => item.product_id == productId);
        if(product.length) {
            return product[0];
        } else {
            return {product_id: productId};
        }
    }

    if (!currentUsers) return <h4>No Users</h4>;


    return (
        <Page 
        title="Inbox"
        >
            <Layout>
                <Layout.Section>
                    <Stack>
                    <Stack.Item>
                    <div style={{width: '260px'}}>
                    <Card sectioned>
                    {currentUsers.map((user, index) => {
                    return (
                        <div className={clsx(classes.convoList, isSelectedUser(index) ? classes.userActive : "")} onClick={() => {
                            handleUserClick(index+((pageNumber-1)*pageSize))
                        }} key={index+'cl'}>
                        <Avatar />
                        <Typography variant="h5" component="h5" className={classes.userName}>{user.cust_name}</Typography>
                        </div>
                        )
                    })}
                    {!currentUsers.length || !currentUsers ? <div><h6>No Users</h6></div> : <></>}
                    <div className={classes.pagination}>
                        <span className={clsx(classes.pageNumber, pageNumber==1 ? classes.disable : "")} onClick={() => {setPageNumber(pageNumber-1)}} ><ChevronLeft/></span>
                        <span className={clsx(classes.pageNumber, currentUsers.length < pageSize ? classes.disable : "")} onClick={() => {setPageNumber(pageNumber+1)}} ><ChevronRight/></span>
                    </div>
                    </Card>   
                    </div>
                    </Stack.Item>
                    <Stack.Item fill>
                        <div style={{width: 'auto'}}>
                        <Card title="Conversation" sectioned>
                        {selectedConv.content && selectedConv.content.map((msg, index) => 
                        { return (msg.user ? 
                            <>
                            {msg.user.text_input ? <ChatMsg key={index+'msg'} side={'left'} messages={[msg.user.text_input]} /> : <></>}
                            {msg.user.product_id ? <ChatMsg key={index+'id'} side={'left'} messages={[msg.user.product_id]} /> : <></>}
                            {msg.user.tags ? <ChatMsg key={index+'tags'} side={'left'} messages={[msg.user.tags]} /> : <></>}
                            </>
                             : 
                            <>
                            {msg.bot.text ? <ChatMsg key={index+'msg'} side={'right'} messages={[msg.bot.text]} /> : <></>}
                            {msg.bot.items ? JSON.parse(msg.bot.items).map((item, index) => <ChatMsg key={index+'item'} side={'right'} messages={[<ProductCard product={item} key={index+'item'}/>]} />) : <></>}
                            {msg.bot.tags ? msg.bot.tags.map((tag, index) => <ChatMsg key={index+'tag'} side={'right'} messages={[tag]} />) : <></>}
                            </>
                        )}
                        )}
                        {!selectedConv || !selectedConv.content ? <div><h6>No Conversations</h6></div> : <></>}
                        </Card>
                        </div>
                    </Stack.Item>
                </Stack>
                </Layout.Section>
            </Layout>
        </Page>
    )
}

export default Inbox
     