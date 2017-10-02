import React from 'react';
import style from './Calendar.css';
import DatePicker from 'react-datepicker';
import CustomInput from './CustomInput.jsx';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

moment.locale('fr');
const hours = [8, 10, 12, 14, 16, 18];


class Calendar extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            startDate: moment(),
            selectedDate : moment(),
            currentHour : 0,
            reserved : []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        let self = this;
        let tmp = [];
        this.setState({selectedDate: date});
        hours.map(function(hour) {
            let day = date.startOf('day');
             self.getIsReserved(day.add(hour, 'h')).then(res => tmp.push(res));
    });
        this.setState({reserved: tmp});
        console.log('couc', tmp);
}

    getIsReserved(dateTime) {
         return axios
                .get('/getIsReserved/' + this.props.roomIndex + '/' + dateTime.format('X'))
                .then(res => {console.log(res.data) ;return res.data;})
                .catch(err => console.log('get is reserved error : '  + err));
    }

    setIsReserved(dateTime) {
        var config = {
            withCredentials: true,
            headers: {'content-type': 'application/json'}
        };
        axios
            .post('/setIsReserved', {
                roomIndex: this.props.roomIndex,
                date: dateTime.format('X')
            }, config)
            .then(res => console.log('success !' + res))
            .catch(err => console.log('set reserved error : '  + err));
    }

    setHour(e) {
        this.setState({ currentHour : Number(e.target.key)});
        console.log(this.state.currentHour);
    }

    render() {
        var self = this;
        var reserved = true;
        let listHours = hours.map(function(hour) {
            let day = self.state.selectedDate.startOf('day');
            self.getIsReserved(day.add(hour, 'h')).then(res => reserved = res);
            console.log('KJLKJ', reserved);
            //console.log('ALLLLL', self.state.reserved);
            if (reserved === false) {
                return (
                    <span className=""
                          id={style.hCellFree}
                          key={hour}
                          onClick={self.setHour}
                    >
                        <p className={style.cellContent}>{hour + 'h00'}</p>
                        <p>Salle libre</p>
                    </span>
                );
                } else {
                return (
                    <span className="" id={style.hCellBusy} key={hour}>
                        <p className={style.cellContent}>{hour + 'h00'}</p>
                        <p>Salle occupe</p>
                    </span>
            )
            }
        }.bind(this));

        return (
            <div id={style.mainRow}>
                <div className={style.container}>
                    <p className={style.choose}>Choix de la date</p>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <DatePicker customInput={<CustomInput />}
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                minDate={moment()}
                                placeholderText="choose a date"
                    />

                    <p className={style.choose}>Choix de l'horaire</p>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <div className={style.rowHours}>
                        {listHours}
                    </div>
                    <span className="glyphicon glyphicon-arrow-down"> </span>
                    <button
                        className="btn btn-success"
                        onClick={ () => this.setIsReserved(this.state.selectedDate.add(this.state.currentHour, 'h'))}
                    >Confirmation</button>
                </div>
            </div>
        );
    }
}

export default Calendar;