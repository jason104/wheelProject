import React from 'react';

import './Wheel.css';

export default class Wheel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
        };
        this.selectItem = this.selectItem.bind(this);
    }

    selectItem() {
        const { items, setSelectedRestaurant } = this.props
        if (this.state.selectedItem === null && this.props.items.length > 0) {
            const selectedItem = Math.floor(Math.random() * items.length);
            const selectedID = this.props.items[selectedItem]._id 
            this.setState({ selectedItem });
            setTimeout(() => { 
                setSelectedRestaurant(selectedID)
            }, 3000)
        } else {
            this.setState({ selectedItem: null });
            setSelectedRestaurant(0)
            setTimeout(this.selectItem, 500);
        }
    }

    render() {
        const { selectedItem } = this.state;
        const { items } = this.props;
        const wheelVars = {
            '--nb-item': items.length,
            '--selected-item': selectedItem,
        };
        const spinning = selectedItem !== null ? 'spinning' : '';

        return (
            <div className="wheel-container">
                <div className={`wheel ${spinning}`} style={wheelVars} onClick={this.selectItem}>
                    {items.map((item, index) => (
                        <div className="wheel-item" key={index} style={{ '--item-nb': index }}>
                            {item.restaurantName}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
