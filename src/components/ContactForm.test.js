import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const header = screen.queryByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render (<ContactForm/>);

    const firstnameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstnameInput, 'abcd');

    const error = await screen.findAllByTestId('error');

    expect(error.length).toBe(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render (<ContactForm/>);

    const button = screen.getByRole('button');
    userEvent.click(button);

    const errors = await screen.findAllByTestId('error');

    expect(errors.length).toBe(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render (<ContactForm/>);

    const firstnameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstnameInput, 'Timothy');

    const lastnameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastnameInput, 'Marchant');

    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = await screen.findAllByTestId('error');

    expect(error.length).toBe(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'abcd');

    const error = await screen.findAllByTestId('error');

    expect(error.length).toBe(1);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const button = screen.getByRole('button');
    userEvent.click(button);

    const errorMsg = await screen.findByText(/lastName is a required field/i);

    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent(/lastName is a required field/i);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)

    const firstnameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstnameInput, 'Timothy');

    const lastnameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastnameInput, 'Marchant');

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'abcd@aol.com');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const first = screen.queryByText(/timothy/i);
        const last = screen.queryByText(/marchant/i);
        const email = screen.queryByText(/abcd@aol.com/i);
        const message = screen.queryByTestId('messageDisplay');

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(message).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const firstnameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstnameInput, 'Timothy');

    const lastnameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastnameInput, 'Marchant');

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'abcd@aol.com');

    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(messageInput, 'heyooo');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const first = screen.queryByText(/timothy/i);
        const last = screen.queryByText(/marchant/i);
        const email = screen.queryByText(/abcd@aol.com/i);
        const message = screen.getByTestId(/message/i);

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(email).toBeInTheDocument();
        expect(message).toBeInTheDocument();
    })
});