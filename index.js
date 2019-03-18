(function(){
	fetch('https://zekas-51feb.firebaseio.com/structuredBookmarks.json')
	.then( res => res.json() )
	.then( data => {
		const result = data[Object.keys(data)];
		callback( result )
	} )

	function callback( result ) {
		const bookmarks = result.map( bookmark => {
			const parentTitle = bookmark.title || '';
			const bookmarksArray = [];
			bookmark.children && bookmark.children.reverse().map( item => {
				item['parentTitle'] = parentTitle;
				bookmarksArray.push(item);
			} )
			return bookmarksArray;
		} )
		let allBookmarks = bookmarks.reduce(( total, next ) => total.concat(next));
		let filterNested = allBookmarks.filter( bookmark => bookmark.children)
		filterNested = filterNested.map( item => {
			return item.children.map(bookmark => {
				const parentTitle = [item.parentTitle, item.title]
				bookmark['parentTitle'] = parentTitle;
				return bookmark;
			})
		} )
		.reduce(( total, next ) => total.concat(next))
		allBookmarks = allBookmarks.concat(filterNested)
		.filter( bookmark => !bookmark.children )

		function handleInput(e){
			const value = e.target.value;
			let inputFiltered = allBookmarks.filter( bookmark => bookmark.title.match(new RegExp( value, 'gi' ))  )
			render(inputFiltered)
		}

		function render(target){
			app.innerHTML = '';
			target.forEach( item => {
                const template = `<div class="card-wrap">
								<a target="_blank" href=${item.url} class="card">
									<h2>${item.title}</h2>
									<p>${Array.isArray(item.parentTitle) ? item.parentTitle.join(' &#8250; ') : item.parentTitle}</p>
								</a>
							</div>`
				app.innerHTML += template
			})
		}
		render(allBookmarks)
		searchInput.removeAttribute('disabled');
		searchInput.addEventListener('input', handleInput);
	}
}())