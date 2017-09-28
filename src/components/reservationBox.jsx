import React from 'react';



class ReservationBox extends React.Component{
    render() {
        if (!this.props.show) {
            return null;
        }

        const dialogStyle = {
                position: 'absolute',
                width: 500,
                border: '1px solid #e5e5e5',
                backgroundColor: 'white',
                boxShadow: '0 5px 15px rgba(0,0,0,.5)',
                padding: 20
        };

        const modalStyle = {
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            top: '50%',
            left:'50%',
        };

        if (this.props.width && this.props.height) {
            modalStyle.width = this.props.width + 'px';
            modalStyle.height = this.props.height + 'px';
            modalStyle.marginLeft = '-' + (this.props.width/2) + 'px',
                modalStyle.marginTop = '-' + (this.props.height/2) + 'px',
                modalStyle.transform = null
        }

        const backdropStyle = {
            position: 'fixed',
            zIndex: 9998,
            top:0, bottom:0, left:0, right:0,
            backgroundColor: '#000',
            opacity: 0.5
        };

        return (

            <div className="" style={backdropStyle}>
                <div className="" style={modalStyle}>
                    <div className="dialog" style={dialogStyle}>
                    {this.props.children}
                    <h4 id='modal-label'>Reservation :</h4>
                        <p>Test du modal !</p>
                        <button onClick={this.props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReservationBox;