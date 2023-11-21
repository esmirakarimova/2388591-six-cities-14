import { useParams } from 'react-router-dom'; //Navigate
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';


import {NearbyOffersList} from '../../components/near-places-list/near-places-list';
import Header from '../../components/header/header';
import ReviewList from '../../components/reviews-list/reviews-list';
import { Map } from '../../components/map/map';

// import { AppRoute } from '../../const';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchNearPlaces, fetchOffer, dropOffer } from '../../store/action';
import { MAX_NEAR_PLACES_COUNT } from '../../const';
import { TCity } from '../../types/offer-type';

const selectedCity: TCity = {
  name: '',
  location: {
    latitude: 0,
    longitude: 0,
    zoom: 0
  }
};

function OfferPage() {
  const {offerId} = useParams();
  const dispatch = useAppDispatch();
  const offer = useAppSelector((state) => state.offer);
  const nearPlaces = useAppSelector((state) => state.nearPlaces);
  const nearPlacesToRender = nearPlaces.slice(0, MAX_NEAR_PLACES_COUNT);

  useEffect(() => {
    if (offerId) {
      dispatch(fetchOffer(offerId));
      dispatch(fetchNearPlaces(offerId));
    }

    return () => {
      dispatch(dropOffer());
    };
  }, [offerId, dispatch]);


  // if(!offer) {
  //   return <Navigate to={AppRoute.NotFound} />;
  // }

  return(
    <div className="page">
      <Helmet><title>{`6 cities | ${offer?.title}`}</title></Helmet>
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer?.images.map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image} alt={`Offer Image ${offer.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer?.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer?.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width={31} height={33}>
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: '80%' }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer?.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer?.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer?.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                Max {offer?.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">{`€${offer?.price}`}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What is inside</h2>
                <ul className="offer__inside-list">
                  {offer?.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src="img/avatar-angelina.jpg"
                      width={74}
                      height={74}
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">Angelina</span>
                  <span className="offer__user-status">Pro</span>
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                  A quiet cozy and picturesque that hides behind a a river by
                  the unique lightness of Amsterdam. The building is green and
                  from 18th century.
                  </p>
                  <p className="offer__text">
                  An independent House, strategically located between Rembrand
                  Square and National Opera, but where the bustle of the city
                  comes to rest in this alley flowery and colorful.
                  </p>
                </div>
              </div>
              <ReviewList />
            </div>
          </div>
          <section className="offer__map map" >
            <Map
              offers={offer ? [...nearPlacesToRender, offer] : nearPlacesToRender}
              specialOfferId={offerId || null}
              block='offer'
              selectedCity={selectedCity}
            />

          </section>

        </section>
        <div className="container">
          <NearbyOffersList nearbyOffers={nearPlacesToRender} />
        </div>
      </main>
    </div>
  );
}

export {OfferPage};