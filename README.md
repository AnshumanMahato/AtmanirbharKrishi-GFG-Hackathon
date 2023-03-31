# GFG-Hackathon
Project for gfg hackathon

User Stories:-

Customer: Login -> look nearby rice farmers and price -> select one -> select pickup/delivery -> pay and chill

Farmer: Associate with a miller( done during user registration)
	  Add Rice info(quantity, price, photos)

Miller: specify milling charges(and storage?) specify transport charges.
	(all probably added to end product price?)
	manage delivery time.(How will delivery time be calculated?)


Implementation:-

1. Data Models
	Customer
		name
		address:{area, pin, city, state}
		password:
		email
		phone
		cart:[Rice]
	Miller
		name
		address:{area, pin, city, state}
		password:
		email
		phone
		minimum milling qty
		mill charges
		storage charges
		delivery charges
	Farmer
		name
		address:{area, pin, city, state}
		password:
		email
		phone
		associated miller
	Order:
		farmer
		quantity
		price
		order status

2. User flows
	Farmer Dashboard ->
		add rice button -> form to take rice quantity, price and other details -> send data to backend
		Amount of rice in stock
		Rice Sold
		Earnings
		change miller

	Miller Dashboard
		Delivery management
		Mill management(which farmer gave how much rice)
		Earnings
		Total rice sale

	Customer
		Marketplace window showing available farmers in city/state.(components with farmer_details/rice_picture and price.
		Selecting each option shows more details like milling charges and other stuff and an buy button
		click buy button -> form for required quantity and pickup/delivery -> pay window -> (payment success) send update to farmer and miller
		Order Tracking
		
		

	User registration
		-> Form to take details{name, address, email. password, phone} -> user entered detail -> send to backend ->  return status
	Login
		-> Form to take email and password -> take info -> send to backend -> verify and return status accordingly



----------------------Under development------------------------		

3. Rest api architecture
	
		user registration(post routes of each model)
		user authentication and authorization -> JWT(JavaScript Web Token) based
			login -> get creds ->  user verification -> (success) send JWT

		General user routes
			edit user (patch route for each model preceded by user verification)
			change password. (patch route for each model preceded by user verification)
			delete account. (delete route for each model preceded by user verification)
			recover password.
		
		Farmer


			

		
			

