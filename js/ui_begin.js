/*  Welcome to the UI_Begin JS component.
    Copyright (C) 2020 Eric Qian. 
    <https://ericqian.me/>
    This component manages the startup 
    interface. 
*/

addLog("<div class='cli-text'>Beginning display...</div>");
const e = React.createElement;

class aboutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { aboutClicked: false };
    }

    render() {
        if (this.state.aboutClicked) {
            return 'Loading about page.';
        }

        return e(
            'button',
            { onClick: () => this.setState({ aboutClicked: true }) },
            'About Me'
        );
    }
}

const domContainer = document.querySelector('#gui-container');
ReactDOM.render(e(aboutButton, infoButton), domContainer);
