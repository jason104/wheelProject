import { Authenticate, SignUp } from "./auth"
import { addNewRestaurant, ClearUsers, ClearRestaurants, getRestaurantList } from "./development"
import { GetUserInfo, UpdateWBList, UpdateVisitedList } from "./main"

const wrap = fn => (...args) => fn(...args).catch(args[2])

function main(app) {
	app.post('/api/signup', wrap(SignUp))
    app.post('/api/auth', wrap(Authenticate))
    app.post('/api/UpdateWBList', wrap(UpdateWBList))
    app.post('/api/UpdateVisitedList', wrap(UpdateVisitedList))

    app.get('/api/getInfo', wrap(GetUserInfo))
    app.get('/api/getRestaurantList', wrap(getRestaurantList))

    app.post('/development/addRestaurant', wrap(addNewRestaurant))
    app.delete('/development/clearUsers', wrap(ClearUsers))
    app.delete('/development/ClearRestaurants', wrap(ClearRestaurants))
    app.get('/development/getRestaurantList', wrap(getRestaurantList))
}	

export default main
