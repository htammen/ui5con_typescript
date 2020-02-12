import {greet} from './greetServer'

function reverse(word: string): string {
	return word.split('').reverse().join('')
}

console.log(reverse('UI5Con'))
//reverse(true)
