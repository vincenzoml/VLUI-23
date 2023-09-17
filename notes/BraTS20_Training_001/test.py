
#%%
import ipyniivue
import nibabel as nib

ipyniivue
# %%
img = nib.load("BraTS20_Training_001_flair.nii.gz")
img2 = nib.load("BraTS20_Training_001_seg.nii.gz")
#%%
nv=ipyniivue.Niivue()

nv.width=400
nv.height=400

#nv.add_object(img)
nv.set_draw_opacity(0.3)
nv.add_volume("BraTS20_Training_001_flair.nii.gz")
nv.set_draw_opacity(0.5)
nv.add_volume("BraTS20_Training_001_seg.nii.gz")
display(nv)