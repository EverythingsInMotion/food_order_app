import React, { useEffect, useState } from 'react';

import classes from './AvailableMeals.module.css'
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

// const DUMMY_MEALS = [
//     {
//         id: 'm1',
//         name: 'Sushi',
//         description: 'Finest fish and veggies',
//         price: 22.99,
//     },
//     {
//         id: 'm2',
//         name: 'Schnitzel',
//         description: 'A german specialty!',
//         price: 16.5,
//     },
//     {
//         id: 'm3',
//         name: 'Barbecue Burger',
//         description: 'American, raw, meaty',
//         price: 12.99,
//     },
//     {
//         id: 'm4',
//         name: 'Green Bowl',
//         description: 'Healthy...and green...',
//         price: 18.99,
//     },
// ];

const DB_URL = `https://react-http-f3cfa-default-rtdb.firebaseio.com/meals.json`


const AvailableMeals = (props) => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch(DB_URL)

            if (!response.ok) {
                throw new Error('Something Went Wrong')
            }

            const data = await response.json();

            const loadedMeals = [];

            for (const key in data) {
                loadedMeals.push({
                    id: key,
                    name: data[key].name,
                    description: data[key].description,
                    price: data[key].price,
                })
            }
            setMeals(loadedMeals);
            setIsLoading(false);
        }

        fetchMeals().catch(error => {

            setIsLoading(false);
            setHttpError(error.message)
        });
    }, [])

    if (isLoading) {
        return (
            <section className={classes.mealsLoading}>
                <p>Loading... Please wait!</p>
            </section>
        )
    }

    if (httpError) {
        return (
            <section className={classes.mealsError}>
                <p>{httpError}</p>
            </section>
        )
    }

    const mealsList = meals.map(meal => (<MealItem
        id={meal.id} // this is new!
        key={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
    />))

    return (
        <>
            <section>
                <Card>
                    <ul className={classes.meals}>
                        {mealsList}
                    </ul>
                </Card>
            </section>
        </>
    )
};

export default AvailableMeals;