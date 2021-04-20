import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'

// import components
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';


// import leaflet css
import "leaflet/dist/leaflet.css"

//import css
import './App.css';

import { sortData, prettyPrintStat } from './util';

function App() {

    const [ countries, setCountries ] = useState([]);
    // how do we remember which option we have selected ? we use another state
    const [ country, setCountry ] = useState("worldwide");

    const [ countryInfo, setCountryInfo ] = useState({});

    const [ tableData, setTableData ] = useState([]);

    const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });

    const [ mapZoom, setMapZoom ] = useState(3);

    const [ mapCountries, setMapCountries ] = useState([]);

    const [ casesType, setCasesType ] = useState("cases")


    useEffect(()=>{
        const fetchCountries = async () => {
            await fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
            setCountryInfo(data)
            })
        };
        fetchCountries();
    }, [])

    // useEffect runs a piece of code
    // based on a given condition i.e >> [condition]

    useEffect(() => {
        // 1) when condition is []
        // the code inside here will runs once
        // when the component loads and not again after
        // 2) when condition is [variable]
        // the code inside here will runs once
        // when the component loads and as 
        // well as when variable changes

        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
            .then((response) => response.json())
            .then((data) => {
                // restructuring the data
                const countries = data.map((country) =>(
                    // returning an object
                    {
                        name: country.country,
                        value: country.countryInfo.iso2 // UK, USA
                    }));

                    const sortedData = sortData(data);
                    setCountries(countries);
                    setTableData(sortedData);
                    setMapCountries(data);
            })
        };
        getCountriesData();
    }, [])


    const onCountryChange = async (event) => {
        // we wanna get countrycode that he has selected
        const countryCode = event.target.value;
        if (countryCode === "worldwide") {
            setMapCenter({ lat: 34.80746, lng: -40.4796 });
            setMapZoom(3);
        }
        setCountry(countryCode)
        // whenever i select something from dropdown i want to make another call

        // https://disease.sh/v3/covid-19/all
        // https://disease.sh/v3/covid-19/countries/[country_code]

        const url = countryCode === 'worldwide'
            ? 'https://disease.sh/v3/covid-19/all'
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            setCountry(countryCode);
            setCountryInfo(data);

            // set lng and lat for specific country and zoom that country
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(5);
        })
    }
    return (
        <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" value={country} onChange={onCountryChange}>
                            <MenuItem value="worldwide">worldwide</MenuItem>
                            {countries.map((country) => (
                                <MenuItem className="app__options" value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="app__stats">
                    <InfoBox
                        isRed
                        onClick={(e) => setCasesType("cases")}
                        active={casesType === "cases"}

                        title="Infected"
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)} />
                    <InfoBox
                        onClick={(e) => setCasesType("recovered")}
                        active={casesType === "recovered"}

                        title="Recovered"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)} />
                    <InfoBox
                        isRed
                        onClick={(e) => setCasesType("deaths")}
                        active={casesType === "deaths"}

                        title="Deaths"
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)} />
                </div>
                <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                    casesType={casesType} />
            </div>
            <Card className="app__right">
                <CardContent>
                    <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                    <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
                    <LineGraph className="app__graph" casesType={casesType} />
                </CardContent>
            </Card>
        </div>
    )
};

export default App;