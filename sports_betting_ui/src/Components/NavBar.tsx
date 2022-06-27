import React from 'react';
import { Nav } from 'react-bootstrap';

const NavBar = () => {
    return (
        <div>
            <Nav fill variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                    <Nav.Link href="/home">Baseball</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="/">Football</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Hockey</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Soccer</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">MMA</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default NavBar;