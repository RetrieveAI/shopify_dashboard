import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Tooltip, Typography } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() => ({
    productButton: {
        display: 'flex',
        margin: '5px'
    },
    cardAction: {
        height: "185px",
        color: '#fff'
    },
    card: {
        flexWrap: "nowrap",
        borderRadius: "10px",
        width: 175,
        margin: 10
    },
    productImage: {
        objectFit: "cover",
        height: 120,
        //paddingTop: "5px",
        backgroundSize: "contain",
        transition: "0.2s",
        "&:hover": {
          transform: "scale(2.1)",
        },
    },
    productTitle: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      fontSize: "16px",
      color: '#000'
    },
    productDesc: {
      fontSize: 12,
      display: "flex",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      color: '#000'
    },
    action: {
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
    },
}))
const ProductCard = ({product}) => {
    const classes = useStyles()
    return (
        <div>
            {/* <Card>
                {product.title ? <h1>{product.title}</h1> : <h1>{product.product_id}</h1>}
            </Card> */}
            <Card className={classes.card}>
              <a style={{ textDecoration: 'none' }}>
                <CardActionArea className={classes.cardAction}>
                    <CardMedia
                    component="img"
                    alt={product.title}
                    height="140"
                    image={product.images.length ? product.images[0].src : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png" }
                    className={classes.productImage}
                    />
                    <CardContent>
                            <Tooltip
                              title={product.title}
                              placement="top"
                            >
                              <Typography
                                className={classes.productTitle}
                                variant="h6"
                                component="h3"
                              >
                                {product.title}
                              </Typography>
                            </Tooltip>
                            <Typography
                              className={classes.productDesc}
                              variant="body1"
                              component="p"
                              dangerouslySetInnerHTML={{ __html: product.body_html }}
                            />
                    </CardContent>
                </CardActionArea>
              </a>
                <CardActions className={classes.action}>
                  <Button className={classes.productButton} disableRipple size="medium" variant="contained" color="primary">Buy</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default ProductCard
