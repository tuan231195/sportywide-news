import React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';

export default class ContactPage extends React.Component {
    static getInitialProps() {
        return {
            showFooter: true,
        };
    }

    render() {
        return (
            <Segment>
                <Header as={'h3'}>Contact us</Header>
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input placeholder="First Name" />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input placeholder="Email" />
                    </Form.Field>
                    <Form.Field>
                        <label>Enquiry</label>
                        <textarea placeholder="Enquiry" />
                    </Form.Field>
                    <Button type="submit" primary>
                        Submit
                    </Button>
                </Form>
            </Segment>
        );
    }
}
