var React = require('react');

// An input field to choose the tag you want to show on the map
class ChooseTagComponent extends React.Component {
    render() {
        return (
            <form id='choose-tag' onSubmit={this.handleSubmit.bind(this)}>
                <input type="text" required ref="chosenTag" placeholder="Entrez votre tag" />
                <input type="submit" value="Choose" />
            </form>
        )
    }; //render
    // <Link to="/map"><input type="submit" value="Choose" /></Link>
    handleSubmit(e) {
        e.preventDefault();
        this.props.onChoose(this.refs.chosenTag.value);
        this.refs.chosenTag.value = '';
    }

};

module.exports = ChooseTagComponent;