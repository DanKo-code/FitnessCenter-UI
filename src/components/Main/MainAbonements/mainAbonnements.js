import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, Slider} from "@mui/material";
import TextField from "@mui/material/TextField";
import AbonnementCard from "./AbonementsCard/abonementCard";
import showErrorMessage from "../../../utils/showErrorMessage";
import {Resource} from "../../../context/AuthContext";


export default function MainAbonnements() {

    const [age, setAge] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [validityPeriodSearch, setValidityPeriodSearch] = useState('');
    const [abonnements, setAbonnements] = useState([]);
    const [searchedAbonnements, setSearchedAbonnements] = useState([]);
    const [showAbonnementsList, setShowAbonnementsList] = useState(true);
    const [maxAbonementPrice, setMaxAbonementPrice] = useState(0);
    const [minAbonementPrice, setMinAbonementPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([0, 0]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortFilter, setSortFilter] = useState("title");

    useEffect(() => {
        Resource.get('/abonements')
            .then(response => {
                if (response.data.abonements?.abonementsWithServices?.length > 0) {
                    let abonements = response.data.abonements.abonementsWithServices;

                    setAbonnements(abonements);

                    const sortPrices = abonements.map(abonement => abonement.abonement.price).sort((a, b) => a - b);

                    console.log('sortPrices: ' + JSON.stringify(sortPrices, null, 2));

                    setMaxAbonementPrice(sortPrices[sortPrices.length - 1])
                    setMinAbonementPrice(sortPrices[0])

                    setPriceRange([sortPrices[0], sortPrices[sortPrices.length - 1]])


                    setSearchedAbonnements(sortAbonnements(abonements, sortFilter, sortOrder));
                }
            })
            .catch(error => {
                showErrorMessage(error);
                console.error('Failed to fetch abonnements:', error);
            });
    }, []);

    const handleTitleSearchChange = (event) => {
        setTitleSearch(event.target.value);

        const filtered = filterData(abonnements, event.target.value, validityPeriodSearch, priceRange[0], priceRange[1])

        setSearchedAbonnements(sortAbonnements(filtered, sortFilter, sortOrder));
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);

        const filtered = filterData(abonnements, titleSearch, validityPeriodSearch, newValue[0], newValue[1])

        setSearchedAbonnements(sortAbonnements(filtered, sortFilter, sortOrder));
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
        setSearchedAbonnements(sortAbonnements(searchedAbonnements, sortFilter, event.target.value));
    };

    const sortAbonnements = (abonnements, sortingFilter, order) => {
        return abonnements.slice().sort((a, b) => {
            if (sortingFilter === "price") {
                return order === "asc"
                    ? a.abonement.price - b.abonement.price
                    : b.abonement.price - a.abonement.price;
            }

            if (sortingFilter === "title") {
                const titleA = a.abonement.title.toLowerCase();
                const titleB = b.abonement.title.toLowerCase();

                if (order === "asc") {
                    return titleA.localeCompare(titleB);
                } else {
                    return titleB.localeCompare(titleA);
                }
            }

            return 0;
        });
    };

    function filterData(data, searchName, validityPeriod, minPrice, maxPrice) {
        return data.filter(item => {
            const matchesName = searchName
                ? item.abonement.title.toLowerCase().includes(searchName.toLowerCase())
                : true;

            const matchesValidityPeriod = validityPeriod
                ? item.abonement.validity.includes(validityPeriod)
                : true;

            const matchesPrice = (minPrice === undefined || item.abonement.price >= minPrice) &&
                (maxPrice === undefined || item.abonement.price <= maxPrice);

            return matchesName && matchesPrice && matchesValidityPeriod;
        });
    }

    useEffect(() => {
        if (searchedAbonnements.length === 0) {
            setShowAbonnementsList(false);
        } else {
            setShowAbonnementsList(true);
        }
    }, [searchedAbonnements]);

    function handleValidityPeriodChange(event) {
        const value = event.target.value;

        if (/^\d*$/.test(value)) {
            const numericValue = parseInt(value, 10);
            if ((numericValue >= 1 && numericValue <= 12) || value === "") {
                setValidityPeriodSearch(value);

                const filtered = filterData(abonnements, titleSearch, event.target.value, priceRange[0], priceRange[1])
                setSearchedAbonnements(sortAbonnements(filtered, sortFilter, sortOrder));
            } else {
                setValidityPeriodSearch(validityPeriodSearch)
                const filtered = filterData(abonnements, titleSearch, validityPeriodSearch, priceRange[0], priceRange[1])
                setSearchedAbonnements(sortAbonnements(filtered, sortFilter, sortOrder));
            }
        }
    }

    function handleSortFilterChange(event) {
        setSortFilter(event.target.value);
        setSearchedAbonnements(sortAbonnements(searchedAbonnements, event.target.value, sortOrder));
    }

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
                    <TextField
                        style={{width: '30%'}}
                        fullWidth
                        id="search"
                        label="Name Search"
                        name="search"
                        autoComplete="search"
                        value={titleSearch}
                        onChange={handleTitleSearchChange}>
                    </TextField>

                    <div style={{width: '30%'}}>
                        <div style={{textAlign: 'center'}}>Price:</div>
                        <Slider
                            aria-labelledby="range-slider"
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={minAbonementPrice}
                            max={maxAbonementPrice}
                        />
                    </div>

                    <FormControl style={{width: '30%'}}>
                        <InputLabel id="sort-order-label">Sorting filter</InputLabel>
                        <Select
                            labelId="sort-order-label"
                            id="sort-order"
                            value={sortFilter}
                            onChange={handleSortFilterChange}
                        >
                            <MenuItem value="title">Title</MenuItem>
                            <MenuItem value="price">Price</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
                    <TextField
                        style={{width: '30%'}}
                        fullWidth
                        id="search"
                        label="Validity Period Search"
                        name="search"
                        autoComplete="search"
                        value={validityPeriodSearch}
                        onChange={handleValidityPeriodChange}>
                    </TextField>

                    <FormControl style={{width: '30%'}}>
                        <InputLabel id="sort-order-label">Sorting Order</InputLabel>
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
