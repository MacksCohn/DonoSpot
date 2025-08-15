// Max Cohn
// editing.js
(async () => {
const { useState, useEffect } = React;
const { Header } = window.headerFile;

// Get charity ID from URL
const urlParams = new URLSearchParams(window.location.search);
const cid = urlParams.get('cid') || "3ItNyesqTpHx1XbHNkSl";   // Default to American Red Cross if no ID
const profile = firebase.doc(db, "charities", cid);
const UID = localStorage.getItem('UID');
let isOwner = (await loadProfile(profile)).OwnerUID === UID;

//returns key value pairs - data.Name and data.Bio for now
async function loadProfile() {
    const snap = await firebase.getDoc(profile);
    if (snap.exists()) {
        const data = snap.data();
        return data;
    }
    return {};  // Return empty object if no data
}

//capital = db, lowecase = local
async function saveProfile(name, categories, bio, imageUrls) {
    await firebase.setDoc(profile, {
        Name: name,
        Categories: categories,
        Bio: bio,
        ImageUrls: imageUrls || "", // Ensure this is included
        OwnerUID: UID // Make sure this is preserved
    }, { merge: true });
}

let editableIds = []

function Main() {
    const [mode, setMode] = useState('read');
    const [donateLink, setDonateLink] = useState('https://');
    const [imageUrls, setImageUrls] = useState('');
    const [charityData, setCharityData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadProfile().then((data) => {
            setCharityData(data);
            const donateLinkCheck = data.donate || donateLink;
            setDonateLink(donateLinkCheck);
            if (data.ImageUrls) {
                setImageUrls(data.ImageUrls);
            } else if (data.ImageUrl) {
                setImageUrls(data.ImageUrl);
            }
        });
    }, []);

    const handlePublish = async () => {
        const updates = {};
        let hasErrors = false;
        
        // Collect all updates
        for (const id of editableIds) {
            const element = document.getElementById(id);
            if (element) {
                let value = element.value || element.textContent;
                
                if (id === 'ImageUrls') {
                    value = value.trim();
                    if (value) {
                        const urls = value.split(',')
                            .map(url => url.trim())
                            .filter(url => url)
                            .map(url => {
                                if (!url.startsWith('http')) {
                                    url = 'https://' + url;
                                }
                                return url;
                            });
                        
                        for (const url of urls) {
                            if (!url.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i)) {
                                hasErrors = true;
                                setSuccessMessage('Image URLs must end with .jpg, .jpeg, .png, .gif, or .webp');
                                break;
                            }
                        }
                        
                        value = urls.join(', ');
                    }
                }
                
                updates[id] = value;
            }
        }

        if (hasErrors) return;

        try {
            // Include ImageUrls in the updates
            if (imageUrls) {
                updates.ImageUrls = imageUrls;
            }

            // Donate link required + prefix
            if (!updates.donate || updates.donate.trim() === '') {
                setSuccessMessage('A valid donation link (starting with https://) is required for the Donate button to work.');
                return;
            }
            if (!updates.donate.startsWith('http')) {
                updates.donate = 'https://' + updates.donate;
            }
            
            await firebase.setDoc(profile, updates, { merge: true });
            console.log('Successfully saved:', updates);
            
            // Update local state
            if (updates.ImageUrls) setImageUrls(updates.ImageUrls);
            if (updates.donate) setDonateLink(updates.donate);
            
            // Update charity data
            setCharityData(prev => ({ ...prev, ...updates }));
            
            setSuccessMessage('Success!');
            setTimeout(() => setSuccessMessage(''), 3000);
            setMode('read');
        } catch (error) {
            console.error('Error saving:', error);
            setSuccessMessage('Error saving changes. Please try again.');
        }
    };

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    if (isOwner === true) {
        return(
            <div>
                <ModeButton mode={mode} onToggle={ToggleMode} /> 
                <Editable id='Name' type='h1' mode={mode}>{charityData.Name || 'Loading...'}</Editable>
                <div>
                    <Editable id='Categories' type='p' mode={mode}>{charityData.Categories || 'Loading...'}</Editable>
                </div>
                <Editable id='Bio' type='p' mode={mode}>{charityData.Bio || 'Loading...'}</Editable>
                <MultiImageCarousel mode={mode} imageUrls={imageUrls} setImageUrls={setImageUrls} />
                <DonateButton mode={mode}>{donateLink}</DonateButton>
                <br />
                {successMessage && <div style={{ color: successMessage.includes('Success!') ? 'green' : 'red', fontWeight: 'bold', marginBottom: '10px' }}>{successMessage}</div>}
                <PublishButton onPublish={handlePublish} />
            </div>
        );
    } else {
        return(
            <div>
                <Editable id='Name' type='h1' mode={'read'}>{charityData.Name || 'Loading...'}</Editable>
                <div>
                    <Editable id='Categories' type='p' mode={'read'}>{charityData.Categories || 'Loading...'}</Editable>
                </div>
                <Editable id='Bio' type='p' mode={'read'}>{charityData.Bio || 'Loading...'}</Editable>
                <MultiImageCarousel mode={'read'} imageUrls={imageUrls} />
                <DonateButton mode={'read'}>{donateLink}</DonateButton>
            </div>
        );
    }
}

function MultiImageCarousel({mode, imageUrls, setImageUrls}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);

    // Parse and update image URLs whenever the prop changes
    useEffect(() => {
        const urls = (imageUrls || '').split(',').map(url => url.trim()).filter(url => url);
        setCurrentImages(urls);
    }, [imageUrls]);

    const handleImageError = (e) => {
        console.error('Failed to load image:', e.target.src);
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
        setHasError(true);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
        );
    };

    if (mode === 'read') {
        return (
            <div className="image-carousel">
                {currentImages.length > 0 && (
                    <>
                        <h3>Gallery</h3>
                        <div className="carousel-container">
                            {currentImages.length > 1 && (
                                <button className="carousel-button prev" onClick={prevImage}>
                                    &lt;
                                </button>
                            )}
                            <div className="carousel-slide">
                                {isLoading && <p className="image-loading">Loading image...</p>}
                                {hasError && (
                                    <p className="image-error">
                                        Couldn't load image. Please check the URL is correct.
                                    </p>
                                )}
                                <img 
                                    src={currentImages[currentIndex]}
                                    alt={`Charity image ${currentIndex + 1}`}
                                    className="carousel-image"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    onLoadStart={() => setIsLoading(true)}
                                />
                            </div>
                            {currentImages.length > 1 && (
                                <button className="carousel-button next" onClick={nextImage}>
                                    &gt;
                                </button>
                            )}
                        </div>
                        {currentImages.length > 1 && (
                            <div className="carousel-indicators">
                                {currentImages.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    } else if (mode === 'edit') {
        return (
            <div className="image-edit">
                <label>Image URLs (comma separated):</label>
                <textarea
                    id='ImageUrls'
                    value={imageUrls || ''}
                    onChange={(e) => {
                        setImageUrls(e.target.value);
                        setHasError(false);
                    }}
                    placeholder="https://i.imgur.com/example1.jpg, https://i.imgur.com/example2.jpg"
                    rows={3}
                />
                <p className="image-hint">
                    <strong>Example:</strong> https://i.imgur.com/nQUJW9e.jpeg, https://i.imgur.com/example2.jpg
                </p>
                
                {currentImages.length > 0 && (
                    <div className="carousel-preview">
                        <h4>Live Preview:</h4>
                        <div className="carousel-container">
                            {currentImages.length > 1 && (
                                <button className="carousel-button prev" onClick={prevImage}>
                                    &lt;
                                </button>
                            )}
                            <div className="carousel-slide">
                                {isLoading && <p className="image-loading">Loading preview...</p>}
                                <img 
                                    src={currentImages[currentIndex]}
                                    alt={`Preview ${currentIndex + 1}`}
                                    className="preview-image"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    onLoadStart={() => setIsLoading(true)}
                                />
                                {hasError && (
                                    <p className="image-error">
                                        Couldn't load preview. Check the URL is correct and publicly accessible.
                                    </p>
                                )}
                            </div>
                            {currentImages.length > 1 && (
                                <button className="carousel-button next" onClick={nextImage}>
                                    &gt;
                                </button>
                            )}
                        </div>
                        {currentImages.length > 1 && (
                            <div className="carousel-indicators">
                                {currentImages.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

function ModeButton({mode, onToggle}) {
    if (mode === 'read')
        return(
            <button onClick={onToggle}>Edit</button>
        );
    else if (mode === 'edit')
        return(
            <>
                <button onClick={onToggle} style={{ backgroundColor: 'green', color: 'white', fontWeight: 'bold' }}>Preview</button>
                <br />
            </>
        );
}

function PublishButton({ onPublish }) {
    return(
        <button onClick={onPublish}>Publish Changes</button>
    );
}
 
function PublishChanges() {
    const updates = {};
    let hasErrors = false;
    
    // Collect all updates
    for (const id of editableIds) {
        const element = document.getElementById(id);
        if (element) {
            let value = element.value || element.textContent;
            
            // Special handling for ImageUrls
            if (id === 'ImageUrls') {
                value = value.trim();
                if (value) {
                    // Process each URL
                    const urls = value.split(',')
                        .map(url => url.trim())
                        .filter(url => url)
                        .map(url => {
                            if (!url.startsWith('http')) {
                                url = 'https://' + url;
                            }
                            return url;
                        });
                    
                    // Basic URL validation
                    for (const url of urls) {
                        if (!url.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i)) {
                            hasErrors = true;
                            alert('Image URLs must end with .jpg, .jpeg, .png, .gif, or .webp');
                            break;
                        }
                    }
                    
                    value = urls.join(', ');
                }
            }
            
            updates[id] = value;
        }
    }

    if (hasErrors) return;

    // Save to Firestore
    firebase.setDoc(profile, updates, { merge: true })
        .then(() => {
            console.log('Successfully saved:', updates);
            // Update local state without reloading
            if (updates.ImageUrls) {
                setImageUrls(updates.ImageUrls);
            }
            if (updates.donate) {
                setDonateLink(updates.donate);
            }
            setMode('read'); // Switch back to read mode
        })
        .catch((error) => {
            console.error('Error saving:', error);
            alert('Error saving changes. Please try again.');
        });
}

function Editable({ type, children, mode, id}) {
    const Type = type;
    const [text, setText] = useState(children);
    const [sizeOption, setSizeOption] = useState('None');
    const typeOptions = ['Disaster Relief','Food','War','Health', 'Veterans'];
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [typeOpen, setTypeOpen] = useState(false);

    useEffect(() => {
        setText(children);
    }, [children]);

    useEffect(() => {
        loadProfile(profile).then((data) => {
            if (data[id]) setText(data[id]);
        });
    }, []);

    useEffect(() => {
        if (id === 'Categories') {
            const parts = (text || '').split(',').map(s => s.trim()).filter(Boolean);
            let size = 'None';
            ['Small','Medium','Large'].forEach(s => {
                if (parts.map(p=>p.toLowerCase()).includes(s.toLowerCase())) size = s;
            });
            setSizeOption(size);
            const set = new Set();
            parts.forEach(p => {
                if (!['Small','Medium','Large'].includes(p)) {
                    const match = typeOptions.find(opt => opt.toLowerCase() === p.toLowerCase());
                    if (match) set.add(match);
                }
            });
            setSelectedTypes(set);
        }
    }, [text, id]);

    if (!editableIds.includes(id))
        editableIds.push(id);

    if (type === 'button') {
        if (mode === 'read') {
            const safeHref = text ? (text.startsWith('http') ? text : 'https://' + text) : '';
            return(
                <a href={safeHref}>
                    <Type id={id} className='donate'>Donate</Type>
                </a>
            );
        }
        else if (mode === 'edit') {
            return(
                <>
                Donation Link:
                <textarea id={id} value={text || 'https://'} onChange={(e) => setText(e.target.value)}></textarea>
                <br/>
                </>
            );
        }
    }
    else {
        if (mode === 'read') {
            return(
                <Type id={id}>{text}</Type>
            );
        }
        else if (mode === 'edit') {
            if (id === 'Categories') {
                const combined = () => {
                    const out = [];
                    if (sizeOption !== 'None') out.push(sizeOption);
                    out.push(...Array.from(selectedTypes));
                    return out.join(', ');
                };
                const displaySelected = selectedTypes.size > 0 ? Array.from(selectedTypes).join(', ') : 'Select type(s)';
                return(
                    <>
                    <label htmlFor={id}>Categories:</label>
                    <div style={{ marginBottom: '8px' }}>
                        <span>Size: </span>
                        <select
                            value={sizeOption}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSizeOption(val);
                                setText([val !== 'None' ? val : null, ...Array.from(selectedTypes)].filter(Boolean).join(', '));
                            }}
                        >
                            <option>None</option>
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                        </select>
                    </div>

                    <div style={{ position:'relative', maxWidth:'600px', marginBottom:'6px' }}>
                        <label>Type: </label>
                        <select
                            value={displaySelected}
                            onMouseDown={(e) => { e.preventDefault(); setTypeOpen(!typeOpen); }}
                            onChange={() => {}}
                            style={{ width:'100%' }}
                        >
                            <option value={displaySelected}>{displaySelected}</option>
                        </select>

                        {typeOpen && (
                            <div className="category-dropdown" >
                                {typeOptions.map(t => (
                                    <div key={t} className="category-option">
                                    <label>
                                        <span>{t}</span>
                                        <input
                                            type="checkbox"
                                            checked={selectedTypes.has(t)}
                                            onChange={() => {
                                                const next = new Set(selectedTypes);
                                                if (next.has(t)) next.delete(t); else next.add(t);
                                                setSelectedTypes(next);
                                                setText([
                                                    sizeOption !== 'None' ? sizeOption : null,
                                                    ...Array.from(next)
                                                ].filter(Boolean).join(', '));
                                            }}
                                        />
                                    </label>
                                    <br />
                                    </div>
                                ))}
                                <div style={{ textAlign:'right', marginTop:'4px', padding:'0 6px 6px' }}>
                                    <button type="button" onClick={()=>setTypeOpen(false)} style={{ padding:'6px 10px' }}>Confirm Categories</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <input type="hidden" id={id} value={combined()} readOnly />
                    <br/>
                    </>
                );
            } else {
                return(
                    <>
                    {id === 'Bio' && <label htmlFor={id}>Description:</label>}
                    {id === 'Categories' && <label htmlFor={id}>Categories:</label>}
                    <textarea id={id} value={text} onChange={(e) => setText(e.target.value)}></textarea>
                    <br/>
                    </>
                );
            }
        }
    }
}

function DonateButton({mode, children}) {
    return(
        <>
        <Editable id='donate' mode={mode} type='button'>{children}</Editable>
        </>
    );
}

const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot(document.getElementById('main'));
mainRoot.render(<Main mode='edit'/>);
})()
