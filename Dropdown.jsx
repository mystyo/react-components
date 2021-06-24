import React from 'react';
import './Dropdown.scss';

class Dropdown extends React.Component {
    static defaultProps = {
        label: "",
        name: "",
        editMode: true,
        value: "",
        data: [],
        valueIndex: "value",
        nameIndex: "text",
        defaultFirstItem: false
    }

	state = {
		value: this.props.value,
        selectedValue: "",
        showList: false,
        isValid: false,
        newData: [],
        preSelectedItem: ""
	}

    componentDidMount() {
        if(this.props.defaultFirstItem){
            const { data, nameIndex, valueIndex } = this.props;

            const value = data[0][nameIndex];
            const selectedValue = data[0][valueIndex];

            this.setState({
                value: value,
                selectedValue: selectedValue
            });

            if(this.props.handleEventChange){
                this.props.handleEventChange(this.props.name, selectedValue);
            }
        }
    }

	handleInputChange = (event) => {
        const { data, nameIndex, valueIndex } = this.props;

        let value =  event.target.value;
        if(value === undefined){
            value = event.target.innerText;
        }
        
        let newData = data.filter(x => x[nameIndex].toLowerCase().startsWith(value.toLowerCase()));
        let showList = true;

        let foundDataItem = newData.find(x => x[nameIndex] == value)
        let selectedValue;
        if(foundDataItem){
            showList = false;
            newData = [];
            selectedValue = foundDataItem[valueIndex]
        }

        console.log(newData);

        this.setState({
            value: value,
            selectedValue: event.target.dataset.value,
            showList: showList,
            newData: newData
        })

        if(this.props.handleInputChange){
            this.props.handleInputChange(value);
        }
        if(this.props.handleEventChange){
            this.props.handleEventChange(this.props.name, selectedValue);
        }

	}

    handleDropdownItemClick = (event) => {
        this.handleInputChange(event);
        // this.setState(state => {            
        //     return {
        //         showList: false,
                
        //     };
        // })
    }

    handleDropdownCollapsible = () => {
        this.setState(state => {
            return {
                showList: !state.showList
            };
        })
    }

    handleInputFocus = (event) => {

    }

    handleCancelButton = () => {
        this.setState({
            selectedValue: undefined,
            value: "",
            newData: []
        })
    }

    renderList(showList){
        if(!showList){
            return;
        }

        const { data, valueIndex, nameIndex } = this.props;
        const { newData } = this.state;

        let dataSource = data;
        if(newData.length > 0){
            dataSource = newData;
        }

        return (
            <div className="collapsible">
                {dataSource.map(item => (
                    <div onClick={this.handleDropdownItemClick} className="dropdown-item" key={item[valueIndex]} data-value={item[valueIndex]}>{item[nameIndex]}</div>
                ))}
            </div>
        )

    }

	render() {
        const { showList } = this.state;
        const { label, editMode, staticValue } = this.props;

        if(!editMode){
            return (
                <div className="static-input">
                    <div className="static-input-label">{label}</div>
                    <div className="static-input-content">{staticValue}</div>
                </div>
            )
        }

        return (
            <div className="dropdown">
                <div className="dropdown-label">{label}</div>
                <div className="dropdown-content">
                    <div className="dropdown-input-container">
                        <input type="text" value={this.state.value} onChange={this.handleInputChange}></input>
                        <div className="input-button" onClick={this.handleCancelButton}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="input-button" onClick={this.handleDropdownCollapsible}>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    {this.renderList(showList)}
                </div>
            </div>
        )
	}
}

export default Dropdown;