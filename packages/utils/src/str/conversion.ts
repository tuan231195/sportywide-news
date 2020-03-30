export function ucfirst(str) {
	str = str.toLowerCase();
	return str.charAt(0).toUpperCase() + str.substr(1);
}
