import React from 'react';

// import css
import './InfoBox.css'

import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, total, active, isRed, ...props }) {
    // we are spreading all the props which means onClick is inside here
    //why --selected why not __selected in BEM
    // because --selected will change the element
    // add this class if its active
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
