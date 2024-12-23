import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, Slider} from "@mui/material";
import TextField from "@mui/material/TextField";
import AbonnementCard from "./AbonementsCard/abonementCard";
import showErrorMessage from "../../../utils/showErrorMessage";
import {Resource} from "../../../context/AuthContext";


export default function MainAbonnements() {

    const [age, setAge] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [abonnements, setAbonnements] = useState([]);
    const [searchedAbonnements, setSearchedAbonnements] = useState([]);
    const [showAbonnementsList, setShowAbonnementsList] = useState(true);
    const [maxAbonementPrice, setMaxAbonementPrice] = useState(0);
    const [minAbonementPrice, setMinAbonementPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        Resource.get('/abonements')
            .then(response => {
                if (response.data.abonements?.abonementsWithServices?.length > 0) {
                    let abonements = response.data.abonements.abonementsWithServices;

                    setAbonnements(abonements);

                    const sortPrices = abonements.map(abonement => abonement.abonement.price).sort((a, b) => a - b);

                    setMaxAbonementPrice(sortPrices[sortPrices.length - 1] + 100);
                    setMinAbonementPrice(sortPrices[0]);
                    setPriceRange([0, sortPrices[sortPrices.length - 1] + 100]);

                    setSearchedAbonnements(sortAbonnements(abonements, sortOrder));
                }
            })
            .catch(error => {
                showErrorMessage(error);
                console.error('Failed to fetch abonnements:', error);
            });
    }, []);

    const handleTitleSearchChange = (event) => {
        setTitleSearch(event.target.value);

        const filtered = abonnements.filter(abonnement =>
            abonnement.abonement.title.toLowerCase().includes(event.target.value.toLowerCase()) &&
            abonnement.abonement.price >= priceRange[0] &&
            abonnement.abonement.price <= priceRange[1]
        );

        setSearchedAbonnements(sortAbonnements(filtered, sortOrder));
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);

        const filtered = abonnements.filter(abonnement =>
            abonnement.abonement.price >= newValue[0] &&
            abonnement.abonement.price <= newValue[1]
        );

        setSearchedAbonnements(sortAbonnements(filtered, sortOrder));
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
        setSearchedAbonnements(sortAbonnements(searchedAbonnements, event.target.value));
    };

    const sortAbonnements = (abonnements, order) => {
        return abonnements.slice().sort((a, b) => {
            return order === "asc"
                ? a.abonement.price - b.abonement.price
                : b.abonement.price - a.abonement.price;
        });
    };

    useEffect(() => {
        if (searchedAbonnements.length === 0) {
            setShowAbonnementsList(false);
        } else {
            setShowAbonnementsList(true);
        }
    }, [searchedAbonnements]);

    return (
        <div style={{
            width: '70%',
            height: '100vh',
            background: 'rgba(117,100,163,255)',
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                marginLeft: '5%',
                marginRight: '5%'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{width: '30%'}}>
                        <div style={{textAlign: 'center'}}>Price:</div>
                        <Slider
                            aria-labelledby="range-slider"
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={maxAbonementPrice}
                        />
                    </div>

                    <TextField
                        style={{width: '30%'}}
                        fullWidth
                        id="search"
                        label="Name Search"
                        name="search"
                        autoComplete="search"
                        value={titleSearch}
                        onChange={handleTitleSearchChange}
                    />

                    <FormControl style={{width: '30%'}}>
                        <InputLabel id="sort-order-label">Sort by Price</InputLabel>
                        <Select
                            labelId="sort-order-label"
                            id="sort-order"
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    {showAbonnementsList ? (
                        <div style={{marginTop: '40px', height: '400px', overflowY: 'scroll'}}>
                            {searchedAbonnements.map(abonnement => (
                                <AbonnementCard abonnement={abonnement} width={'600px'} height={'400px'}
                                                buyButton={{buttonState: true}}/>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            marginTop: '40px',
                            width: "600px",
                            height: "400px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "20px"
                        }}>
                            There are no such abonnements
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
