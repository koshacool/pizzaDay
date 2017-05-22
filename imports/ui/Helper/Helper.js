import { Menu } from '../../api/menu.js';

export const Helper = {
    countEvailableItems (object) {
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

    countAllPrice(event) {
        availableUsers = Object.keys(event.available.users).filter((id) => event.available.users[id]);
        return availableUsers.reduce((prev, userId) =>
                prev + this.countUserTotalPrice(event, userId)
             , 0).toFixed(2);
    }




};

