import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommentDto, commentsService, Paginated, ParentType } from '@/services/commentsService';
import { enqueue } from '@/offline/mutationQueue';

export interface CommentsState {
	byParent: Record<string, { items: CommentDto[]; page: number; total: number; loading: boolean }>;
}

const initialState: CommentsState = {
	byParent: {},
};

function keyFor(parentType: ParentType, parentId: string): string {
	return `${parentType}:${parentId}`;
}

export const fetchComments = createAsyncThunk(
	'comments/fetch',
	async (payload: { parentType: ParentType; parentId: string; page?: number; limit?: number }) => {
		const res = await commentsService.list(payload.parentType, payload.parentId, payload.page ?? 1, payload.limit ?? 20);
		return { ...payload, res } as { parentType: ParentType; parentId: string; res: Paginated<CommentDto> };
	}
);

export const createComment = createAsyncThunk(
	'comments/create',
	async (payload: { parentType: ParentType; parentId: string; text: string }, { rejectWithValue }) => {
		try {
			return await commentsService.create(payload);
		} catch (e) {
			await enqueue('createComment', payload);
			return rejectWithValue('queued');
		}
	}
);

export const updateComment = createAsyncThunk('comments/update', async (payload: { id: string; text: string }) => {
	const res = await commentsService.update(payload.id, payload.text);
	return res;
});

export const deleteComment = createAsyncThunk('comments/delete', async (id: string) => {
	await commentsService.remove(id);
	return id;
});

export const likeComment = createAsyncThunk('comments/like', async (id: string) => {
	const res = await commentsService.like(id);
	return { id, ...res } as { id: string; liked: boolean; likesCount: number };
});

export const unlikeComment = createAsyncThunk('comments/unlike', async (id: string) => {
	const res = await commentsService.unlike(id);
	return { id, ...res } as { id: string; liked: boolean; likesCount: number };
});

const slice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		addLocalComment(state, action: PayloadAction<CommentDto>) {
			const k = keyFor(action.payload.parentType, action.payload.parentId);
			state.byParent[k] = state.byParent[k] || { items: [], page: 1, total: 0, loading: false };
			state.byParent[k].items.unshift(action.payload);
			state.byParent[k].total += 1;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchComments.pending, (state, action) => {
				const { parentType, parentId } = action.meta.arg as any;
				const k = keyFor(parentType, parentId);
				state.byParent[k] = state.byParent[k] || { items: [], page: 1, total: 0, loading: false };
				state.byParent[k].loading = true;
			})
			.addCase(fetchComments.fulfilled, (state, action) => {
				const { parentType, parentId, res } = action.payload;
				const k = keyFor(parentType, parentId);
				state.byParent[k] = state.byParent[k] || { items: [], page: 1, total: 0, loading: false };
				state.byParent[k].items = res.data;
				state.byParent[k].page = res.page;
				state.byParent[k].total = res.total;
				state.byParent[k].loading = false;
			})
			.addCase(createComment.fulfilled, (state, action) => {
				if (!action.payload) return;
				const c = action.payload as CommentDto;
				const k = keyFor(c.parentType, c.parentId);
				state.byParent[k] = state.byParent[k] || { items: [], page: 1, total: 0, loading: false };
				state.byParent[k].items.unshift(c);
				state.byParent[k].total += 1;
			})
			.addCase(updateComment.fulfilled, (state, action) => {
				const c = action.payload;
				const k = keyFor(c.parentType, c.parentId);
				const idx = state.byParent[k]?.items.findIndex((x) => x._id === c._id);
				if (idx != null && idx >= 0) {
					state.byParent[k].items[idx] = c;
				}
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				for (const k of Object.keys(state.byParent)) {
					const idx = state.byParent[k].items.findIndex((x) => x._id === action.payload);
					if (idx >= 0) {
						state.byParent[k].items.splice(idx, 1);
						state.byParent[k].total = Math.max(0, state.byParent[k].total - 1);
						break;
					}
				}
			})
			.addCase(likeComment.fulfilled, (state, action) => {
				for (const k of Object.keys(state.byParent)) {
					const idx = state.byParent[k].items.findIndex((x) => x._id === action.payload.id);
					if (idx >= 0) {
						state.byParent[k].items[idx].likesCount = action.payload.likesCount;
						break;
					}
				}
			})
			.addCase(unlikeComment.fulfilled, (state, action) => {
				for (const k of Object.keys(state.byParent)) {
					const idx = state.byParent[k].items.findIndex((x) => x._id === action.payload.id);
					if (idx >= 0) {
						state.byParent[k].items[idx].likesCount = action.payload.likesCount;
						break;
					}
				}
			});
	},
});

export const { addLocalComment } = slice.actions;
export default slice.reducer;