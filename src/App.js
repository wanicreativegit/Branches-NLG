import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import axios from 'axios';
import MyGreatPlace from './my_great_place.jsx';
import SearchInput, {createFilter} from 'react-search-input'
//import styles from './map.css';
//import emails from './mails'


const KEYS_TO_FILTERS = ['title', 'city'];


class Form extends Component {


    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            show_fields: 0,
            posts: [],
            pins: [],
            out: [],
            show_map: 0
        };
        this.searchUpdated = this.searchUpdated.bind(this)

    }


    componentWillMount() {

        var _this = this;
        var newArray = this.state.posts.slice();

        this.serverRequest =
            axios
                .get("http://nlg.wanilab.com/wp-json/wp/v2/branches_posts/?per_page=100")
                .then(function (response) {

                    var posts_ = response.data;

                    posts_.map(function (out, index) {


                        var location = out.acf.location;

                        if (location.address) {


                            var lat = parseFloat(location.lat);
                            var lng = parseFloat(location.lng);

                            axios.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + location.address + "&key=AIzaSyDn7tG3GlFkfBWIPIruaegEkUgnTZlrxK8")
                                .then(function (response) {

                                    var data = response.data.results[0];

                                    if (data.address_components[3].long_name) {
                                        var city = data.address_components[3].long_name;
                                    } else {
                                        city = '';
                                    }

                                    newArray.push({
                                        /*cat: out.taxonomy_ress_posts_category[0].id,
                                         excerpt: striptags(out.excerpt),
                                         url: out.url,
                                         file_url: url_done,
                                         title: out.title,
                                         premium: out.custom_fields.premium,
                                         date: out.date,
                                         author: out.author.name,*/
                                        id: out.id,
                                        city: city,
                                        url: out.link,
                                        title: out.title.rendered,
                                        address: location.address,
                                        coords: {
                                            latitude: lat,
                                            longitude: lng
                                        }

                                    });

                                    _this.setState({
                                        posts: newArray,
                                        show_map: 1
                                    });


                                });


                        }


                    });

                })

    }

    componentWillUnmount() {

        this.serverRequest.abort();

    }

    render() {


        var t = this;
        const filteredEmails = this.state.posts.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

        var pins = this.state.posts;
        if (this.state.show_fields) {
            pins = filteredEmails;
        }

        return (

            <section>

                <div className="full-map">
                    <div className="content">
                        <h1>Find your
                            <strong>local branch</strong>
                        </h1>
                        <h2>we have 50+ offices with national coverage</h2>
                        <div className="search-fields">
                            <SearchInput className="search-input" onChange={this.searchUpdated} />
                            {t.state.show_fields ? <div className="fields">
                                    {filteredEmails.map(email => {
                                        return (
                                            <div className="mail" key={email.id}>
                                                <div className="subject"><a href={email.url}>{email.city}, {email.title}</a></div>
                                            </div>
                                        )
                                    })}
                            </div> : null}
                        </div>
                    </div>
                </div>


                <GoogleMap
                apiKey='AIzaSyDn7tG3GlFkfBWIPIruaegEkUgnTZlrxK8'
                center={[53.3229731, -5.8055253]}
                zoom={7}>

                    {pins.map(function (out) {

                        return (
                            <MyGreatPlace lat={out.coords.latitude} lng={out.coords.longitude} text={out.title} />
                        )

                    })}

                </GoogleMap>
            </section>

        )

    }

    searchUpdated(term) {

        this.setState({searchTerm: term});

        var st = this.state.searchTerm;

        if (st.length > 1) {
            this.setState({show_fields: 1})
        } else {
            this.setState({show_fields: 0})
        }

    }


}


class Allbranches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            posts: []
        };

        this.showList = this.showList.bind(this);
    }


    componentWillMount() {

        var _this = this;
        var newArray = this.state.posts.slice();

        this.serverRequest =
            axios
                .get("http://nlg.wanilab.com/wp-json/wp/v2/branches_posts/?per_page=100")
                .then(function (response) {

                    var posts_ = response.data;

                    posts_.map(function (out, index) {


                        var location = out.acf.location;

                        if (location.address) {


                            var lat = parseFloat(location.lat);
                            var lng = parseFloat(location.lng);

                            newArray.push({
                                /*cat: out.taxonomy_ress_posts_category[0].id,
                                 excerpt: striptags(out.excerpt),
                                 url: out.url,
                                 file_url: url_done,
                                 title: out.title,
                                 premium: out.custom_fields.premium,
                                 date: out.date,
                                 author: out.author.name,*/
                                id: out.id,
                                city: '',
                                url: out.link,
                                title: out.title.rendered,
                                address: location.address,
                                coords: {
                                    latitude: lat,
                                    longitude: lng
                                }

                            });

                            _this.setState({
                                posts: newArray
                            });

                        }


                    });

                })


    }

    showList() {

        this.setState({
            show: !this.state.show
        });

    }

    render() {

        var t = this;

        return (
            <div className="branch--list" >

                <div className={this.state.show ? "big--button show" : "big--button"} onClick={this.showList}>
                    <div className="page-wrapper">
                        <h2>View all NoLettingGo Offices</h2>
                    </div>
                </div>

                <div className="page-wrapper">

                {this.state.show ?
                    <div className="list--branches">
                        {t.state.posts.map(function (item) {
                            return (

                                <div className="item" key={item.id}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <h3 dangerouslySetInnerHTML={{__html: item.title}} ></h3>
                                        </div>
                                        <div className="col-md-4">{item.address}</div>
                                        <div className="col-md-4 text-right">
                                            <a href={item.url} className="grey-button">Website</a>
                                        </div>
                                    </div>
                                </div>

                            )

                        })}
                    </div>
                    :
                    null}

                </div>
            </div>
        )
    }
}


class App extends Component {
    render() {

        var _this = this;

        return (
            <div className="whole-page">
                <Form />
                <Allbranches />
            </div>
        );
    }
}

export default App;
