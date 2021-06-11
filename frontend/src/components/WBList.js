import './WBList.css'
import React, { useState, useEffect} from 'react'
import { Tabs, List, Button } from 'antd'
import SearchBar from './SearchBar' 
import { displayStatus } from './Util'
function WBList(props) {
	const { foodListState, userState, toggleWheel } = props
	const { TabPane } = Tabs;
	const [foodList, setFoodList] = useState([])
	const [user, setUser] = useState(null)
	const [searchWord, setSearchWord] = useState("")
	const [historyList, setHistoryList] = useState([])

	useEffect(() => {
		if (foodListState.foodListLoaded) {
			setFoodList(foodListState.foodList)
		}
	}, [foodListState.foodListLoaded])

	useEffect(() => {
		if (userState.userLoaded) {
			setUser(userState.user)
		}
	}, [userState])

	useEffect(() => {  // set default wheel
		if(!user) return
		if(user.favorite.length <= 3){
			//console.log(user.favorite)
			user.favorite.forEach(food => {toggleWheel(food, "on")})
		}else{
			user.favorite.forEach(food => {toggleWheel(food, "off")})
			const selected = []
			while(selected.length < 3){
				const rndSelect = user.favorite[Math.floor(Math.random() * user.favorite.length)]
				if(!selected.includes(rndSelect)) selected.push(rndSelect)
			}
			selected.forEach(food => {toggleWheel(food, "on")})
		}
	}, [user, foodListState.foodListLoaded])

	const addToList = (listName, restaurantID) => {
		if (listName === 'favorite') {
			if (user.blacklist.includes(restaurantID)) {
				displayStatus({
	        		type: 'error', 
	        		msg: 'I thought you hate it...'
	        	})
			} else if (!user.favorite.includes(restaurantID)) {
				const updatedUser = {...user, favorite: [restaurantID, ...user.favorite]}
				props.handleUserWBListUpdate(updatedUser)
			}
		} else if (listName === 'blacklist') {
			if (user.favorite.includes(restaurantID)) {
				displayStatus({
	        		type: 'error', 
	        		msg: 'I thought it is your favorite...'
	        	})
			} else if (!user.blacklist.includes(restaurantID)) {
				const updatedUser = {...user, blacklist: [restaurantID, ...user.blacklist]}
				props.handleUserWBListUpdate(updatedUser)
			}
		}
	}
	
	const removeFromList = (listName, restaurantID) => {
		if (listName === 'favorite') {
			if (user.favorite.includes(restaurantID)) {
				const updatedUser = {...user, favorite: user.favorite.filter((favoriteID) => { return favoriteID !== restaurantID})}
				props.handleUserWBListUpdate(updatedUser)
			}
		} else if (listName === 'blacklist') {
			if (user.blacklist.includes(restaurantID)) {
				const updatedUser = {...user, blacklist: user.blacklist.filter((blacklistID) => { return blacklistID !== restaurantID})}
				props.handleUserWBListUpdate(updatedUser)
			}
		}
	}


	return(
		<React.Fragment>
			<Tabs type="card" className="Tabs" defaultActiveKey="1" onTabClick={() => {setSearchWord("")}}>
				<TabPane className="TabPane" tab="All" key="1" >
					<SearchBar className="SearchBar" searchWord={searchWord} setSearchWord={setSearchWord}/>
					<nav>
						<List
							dataSource={(props.foodListState.foodListLoaded) ? 
								foodList.filter((restaurant) => (restaurant.restaurantName.includes(searchWord))) : 
								[]}
							size="small"
							renderItem={item => (
								<List.Item key={item._id}>
									<List.Item.Meta
										title={ <button type="button" className="link-button" onClick={() => {props.setShowMap(true); props.setSelectedRestaurant(item._id)}}>{item.restaurantName}</button> }
										description={item.priceTag + ", " + item.categoryTag + ", " + item.regionTag}
									/>
									<Button size="small" shape="round" type="primary" onClick={() => {props.toggleWheel(item._id)}} 
											style={(item.addedToWheel)? {"background":"#994aff82"}:{"background":"#da3768"}}>Wheel</Button>
									<Button size="small" shape="round" type="primary" onClick={() => {addToList('favorite', item._id)}} 
											disabled={user.favorite.includes(item._id)}>Favorite</Button>
									<Button size="small" shape="round" type="primary" onClick={(e) => {addToList('blacklist', item._id)}} 
											style={ (user.blacklist.includes(item._id))? {"background":"white"}:{"background":"gray"}} 
											disabled={user.blacklist.includes(item._id)}>BlackList</Button>								
								</List.Item>
							)}
						/>
					</nav>
				</TabPane>
				<TabPane className="TabPane" tab="My Favorite" key="2">
					<SearchBar className="SearchBar" searchWord={searchWord} setSearchWord={setSearchWord}/>
					<nav>
						<List
							dataSource={(props.foodListState.foodListLoaded && props.userState.userLoaded) ? 
								foodList.filter((restaurant) => user.favorite.includes(restaurant._id) && restaurant.restaurantName.includes(searchWord)) :
								[]
							}
							size="small"
							renderItem={item => (
								<List.Item key={item._id}>
									<List.Item.Meta
										title={ <button type="button" className="link-button" onClick={() => {props.setShowMap(true); props.setSelectedRestaurant(item._id)}}>{item.restaurantName}</button> }
										description={item.priceTag + ", " + item.categoryTag + ", " + item.regionTag}
									/>
                                    <Button size="small" shape="round" type="primary" style={(item.addedToWheel)? {"background":"#994aff82"}: {"background":"#da3768"}} onClick={() => props.toggleWheel(item._id)}>Wheel</Button>
									<Button size="small" shape="round" type="primary" onClick={() => {removeFromList('favorite', item._id)}} style={{"background":"red"}}>Remove</Button>
								</List.Item>
							)}
						/>
					</nav>
				</TabPane>
				<TabPane className="TabPane" tab="My Black List" key="3">
					<SearchBar className="SearchBar" searchWord={searchWord} setSearchWord={setSearchWord}/>
					<nav>
						<List
							dataSource={(props.foodListState.foodListLoaded && props.userState.userLoaded) ? 
								foodList.filter((restaurant)=> (user.blacklist.includes(restaurant._id) && restaurant.restaurantName.includes(searchWord))) :
								[]
							}
							size="small"
							renderItem={item => (
								<List.Item key={item._id}>
									<List.Item.Meta
										title={ <button type="button" className="link-button" onClick={() => {props.setShowMap(true); props.setSelectedRestaurant(item._id)}}>{item.restaurantName}</button> }
										description={item.priceTag + ", " + item.categoryTag + ", " + item.regionTag}
									/>
                                    <Button size="small" shape="round" type="primary" style={(item.addedToWheel)? {"background":"#994aff82"}:{"background":"#da3768"}} onClick={() => props.toggleWheel(item._id)}>Wheel</Button>
									<Button size="small" shape="round" type="primary" onClick={() => {removeFromList('blacklist', item._id)}} style={{"background":"red"}}>Remove</Button>								
								</List.Item>
							)}
						/>
					</nav>
				</TabPane>
				<TabPane className="TabPane" tab="History" key="4" >
					<SearchBar className="SearchBar" searchWord={searchWord} setSearchWord={setSearchWord}/>
					<nav>
						<List
							dataSource={(props.foodListState.foodListLoaded && props.userState.userLoaded) ? 
								user.recentVisit.map(recentID => foodList.find(restaurant => restaurant._id === recentID)) :
								[]
							}
							size="small"
							renderItem={item => (
								<List.Item key={item._id}>
									<List.Item.Meta
										title={ <button type="button" className="link-button" onClick={() => {props.setShowMap(true); props.setSelectedRestaurant(item._id)}}>{item.restaurantName}</button> }
										description={item.priceTag + ", " + item.categoryTag + ", " + item.regionTag}
									/>
                                    <Button size="small" shape="round" type="primary" style={(item.addedToWheel)? {"background":"#994aff82"}:{"background":"#da3768"}} onClick={() => props.toggleWheel(item._id)}>Wheel</Button>
								</List.Item>
							)}
						/>
					</nav>
				</TabPane>
			</Tabs>
		</React.Fragment>
	);
}
export default WBList;