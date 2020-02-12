interface Person {
	name: string
	age?: number
}

function birthYear(person: Person) {
	return 2020 - (person?.age || 0)
}

console.log(birthYear({name: 'Helmut', age: 55}))
