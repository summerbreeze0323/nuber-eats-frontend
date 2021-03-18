import { gql, useLazyQuery } from '@apollo/client';
import React, {useEffect, useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useLocation } from 'react-router';
import { Restaurant } from '../../components/restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [callQuery, { loading, data, called }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    if (!query) {
      return  history.replace('/');
    }

    callQuery({
      variables: {
        input: {
          page,
          query
        }
      }
    })
  }, [history, location]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <h2>Search: </h2>
      <h3>{data?.searchRestaurant.totalResults} Restaurants</h3>
      {!loading && data?.searchRestaurant.restaurants?.length && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.searchRestaurant.restaurants?.map((restaurant, index) => (
              <Restaurant
                key={index}
                id={restaurant.id + ''}
                name={restaurant.name}
                coverImg={restaurant.coverImg}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none font-medium text-2xl"
              >&larr;</button>
            ) : (
              <div></div>
            )}
            <span>Page {page} of {data?.searchRestaurant.totalPages}</span>
            {page !== data?.searchRestaurant.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none font-medium text-2xl"
              >&rarr;</button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}