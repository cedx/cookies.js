/* eslint-disable line-comment-position, no-unused-vars */
import {Cookies} from '@cedx/cookies';

/**
 * Tests the cookie service.
 */
function main() {
  const cookies = new Cookies;

  // Write the cookies.
  console.log(cookies.has('foo')); // false
  console.log(cookies.has('baz')); // false
  console.log(cookies.length); // 0

  cookies.set('foo', 'bar');
  console.log(cookies.has('foo')); // true
  console.log(cookies.length); // 1

  cookies.setObject('baz', {qux: 123});
  console.log(cookies.has('baz')); // true
  console.log(cookies.length); // 2

  // Read the cookies.
  console.log(cookies.get('foo').constructor.name); // "String"
  console.log(cookies.get('foo')); // "bar"

  console.log(cookies.getObject('baz').constructor.name); // "Object"
  console.log(cookies.getObject('baz')); // {qux: 123}
  console.log(cookies.getObject('baz').qux); // 123

  // Delete the cookies.
  cookies.remove('foo');
  console.log(cookies.has('foo')); // false
  console.log(cookies.length); // 1

  cookies.clear();
  console.log(cookies.has('baz')); // false
  console.log(cookies.length); // 0
}
