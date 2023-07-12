const apiServer = ""  // your api server here

export const getRequest = (url, data) => {
  return new Promise((resolve, reject) => {	  
    uni.request({
      url: apiServer + url,
      method: "GET",
      data: data ? data : null,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export const postRequest = (params = {url, data}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: apiServer + params.url,
      method: "POST",
      data: params.data ? params.data : null,
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export const saveData = (key, data) => {
	uni.setStorage({
		key: key,
		data: data,
		encrypt: false
	})
}
export const getData = (key) => {
	return new Promise((resolve, reject) => {
		uni.getStorage({
			key: key,
			success: (res) => {
				resolve(res.data)
			},
			fail: err => {
				if (key === "playinglist") {
					resolve({
						"songs": [],
						"songIds": []
					})
				} else {
					resolve(null)
				}
			}
		})
	})
}

export const savePlayingList = (songs, songIds) => {
	saveData("playinglist", {
		"songs": songs,
		"songIds": songIds
	})
}

export const getPlayingList = () => {
	return getData("playinglist")
}