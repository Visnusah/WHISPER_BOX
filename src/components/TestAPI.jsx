// Test file to verify API exports
import { savePost, unsavePost, voteOnPost, removeVoteFromPost } from '../services/api.js'

console.log('API exports test:')
console.log('savePost:', typeof savePost)
console.log('unsavePost:', typeof unsavePost) 
console.log('voteOnPost:', typeof voteOnPost)
console.log('removeVoteFromPost:', typeof removeVoteFromPost)

export default function TestAPI() {
  return <div>API Test Component</div>
}
