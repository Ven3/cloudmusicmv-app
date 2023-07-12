<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		padding: 10rpx;
	}

	.list-title {
		color: #0099BC;
		font-weight: bold;
		width: 100%;
		margin-top: 20rpx;
		;
		font-size: 40rpx;
	}


	.musiclist-btns {
		white-space: nowrap;
		display: flex;
		width: 90%;
		padding: 20rpx;
	}

	.musiclist-btn {
		width: 100%;
		padding-top: 6rpx;
		text-align: center;
		border-radius: 10rpx;
		margin: 0rpx 10rpx 0rpx 10rpx;

	}

	.music-list {
		width: 100%;
	}

	.music-list-item {
		margin: 20rpx;
		white-space: nowrap;
		display: flex;
		text-align: right;
		height: 80rpx;
	}

	.music-list-item-text {
		text-align: left;
		width: 100%;
	}

	.music-list-btn:active {
		background-color: lightgray;
		color: #00B26A;
	}

	.music-list-btn {
		background-color: #00B26A;
		width: 100rpx;
		height: 60rpx;
		text-align: center;
		border-radius: 15rpx;
		font-size: 45rpx;
		font-weight: bold;

	}


	.bg-success {
		background-color: #7CCD64;
		color: #FFFFFF;
	}

	.bg-danger {
		background-color: #f32d2d;
		color: #FFFFFF;
	}

	.bg-warm {
		background-color: #FA8072;
		color: #FFFFFF;
	}
</style>