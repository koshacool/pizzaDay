import { Menu } from '../../api/menu.js';
import { Discount } from '../../api/discount.js';

export const Helper = {
    countEvailableUsers (object) {
        let counter = 0;
        for (let key in object) {
            if (object[key].status) {
                counter++;
            }
        }
        return counter;
    },

    countEvailableFood (object) {
        let counter = 0;
        for (let key in object) {
            if (object[key]) {
                counter++;
            }
        }
        return counter;
    },

    handleInputChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    },

    nonEmptyInput (value)  {
        return value.length > 0;
    },

    hideModalWindow() {
        document.body.removeChild(document.getElementById('modalDiv'));
    },

    checkAllUsersOrdered(event) {
        let orders = event.orders;
        let availebleUsers = event.available.users;
        availebleUsers = Object.keys(availebleUsers)
            .filter((userId) => availebleUsers[userId]);

        return availebleUsers.every((userId) => {
            let result = false;
            if (orders[userId] && orders[userId].order.status == 'ordered') {
                result = true;
            }
            return result;
        })
    },

    countUserTotalPrice(event, userId) {
        var price = 0;
        let userOrder = event.orders[userId];

        if (userOrder) {
            for (var menuId in userOrder.order) {
                if (userOrder.order[menuId].status) {
                    let menuObj = Menu.findOne(menuId);
                    price += menuObj.price * userOrder.order[menuId].number;
                }
            }
        }

        return price;
    },

    getUserOrderNames(event, userId) {        
        let userOrder = event.orders[userId];
        let orderItems = {};
        if (userOrder) {
            for (var menuId in userOrder.order) {
                if (userOrder.order[menuId].status) {
                    let menuObj = Menu.findOne(menuId);
                    orderItems[menuObj.text] = `${userOrder.order[menuId].number} pieces`;
                    //  {
                    //     Auantity: userOrder.order[menuId].number,
                    //     Price: userOrder.order[menuId].price,
                    // };
                }
            }
        }

        return orderItems;
    },

    getAvailableUsers(users) {
        return Object.keys(users).filter((id) => users[id].status);
    },

    countAllPrice(event) {
        availableUsers = this.getAvailableUsers(event.available.users);
        return availableUsers.reduce((prev, userId) =>
                prev + this.countUserTotalPrice(event, userId)
             , 0).toFixed(2);
    }

};

